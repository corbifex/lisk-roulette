import {BigNum} from 'lisk-sdk';
import {getAddressFromPublicKey} from '@liskhq/lisk-cryptography';
import {
    BaseTransaction,
    StateStorePrepare,
    TransactionError,
    StateStore,
    utils,
    TransactionJSON,
    convertToAssetError,
} from '@liskhq/lisk-transactions';
import { Account } from '@liskhq/lisk-transactions/dist-node/transaction_types';

export interface faucetAsset {
    readonly data: string;
}

export const faucetAssetFormatSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
            format: 'username',
        },
    },
};

export class FaucetTransaction extends BaseTransaction {
    public readonly asset: faucetAsset;
    public readonly containsUniqueData: boolean;
    public static TYPE = 101;
    public static FEE = '0';

    public constructor(rawTransaction: unknown) {
        super(rawTransaction);
        const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
            ? rawTransaction
            : {}) as Partial<TransactionJSON>;
        this.asset = (tx.asset || { data: {} }) as faucetAsset;
        this.containsUniqueData = true;
    }

    public async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([
            { address: this.senderId },
            { username: this.asset.data },
        ]);
    }

    protected assetToBytes(): Buffer {
        const { data } = this.asset;

        return Buffer.from(data, 'utf8');
    }

    protected verifyAgainstTransactions(
        _: ReadonlyArray<TransactionJSON>,
    ): ReadonlyArray<TransactionError> {
        return [];
    }

    protected validateAsset(): ReadonlyArray<TransactionError> {
        utils.validator.validate(faucetAssetFormatSchema, this.asset);
        const errors = convertToAssetError(
            this.id,
            utils.validator.errors,
        ) as TransactionError[];

        if (!this.senderId) {
            errors.push(
                new TransactionError(
                    '`senderId` must be provided.',
                    this.id,
                    '.senderId',
                ),
            );
        }

        try {
            utils.validateAddress(this.senderId);
        } catch (error) {
            errors.push(
                new TransactionError(
                    error.message,
                    this.id,
                    '.senderId',
                    this.senderId,
                ),
            );
        }

        if (this.senderPublicKey) {
            const calculatedAddress = getAddressFromPublicKey(
                this.senderPublicKey,
            );
            if (this.senderId !== calculatedAddress) {
                errors.push(
                    new TransactionError(
                        'senderId does not match senderPublicKey.',
                        this.id,
                        '.senderId',
                        this.senderId,
                        calculatedAddress,
                    ),
                );
            }
        }

        return errors;
    }

    protected applyAsset(store: StateStore): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
        const sender = store.account.getOrDefault(this.senderId);
        const balance = new BigNum(sender.balance);
        if (balance.gt(1000000000)) {
            errors.push(
                new TransactionError(
                    'sender balance to high',
                    this.id,
                    '.amount',
                    sender.balance,
                ),
            );
        }
        if (this.asset.data && !sender.username) {
            const usernameExists = store.account.find(
                (account: Account) => account.username === this.asset.data && account.address !== this.senderId,
            );

            if (usernameExists) {
                errors.push(
                    new TransactionError(
                        `Username is not unique.`,
                        this.id,
                        '.asset.username',
                    ),
                );
            }
            store.account.set(this.senderId, {
                ...sender,
                username: this.asset.data,
                isDelegate: 1,
                balance: new BigNum(10000000000).toString(),
            });
        } else {
            store.account.set(this.senderId, {
                ...sender,
                balance: new BigNum(10000000000).toString(),
            });
        }

        return errors;
    }

    protected undoAsset(store: StateStore): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
        const sender = store.account.getOrDefault(this.senderId);
        const balance = new BigNum(sender.balance);
        if (balance.lt(10000000000)) {
            errors.push(
                new TransactionError(
                    'sender balance to low',
                    this.id,
                    '.amount',
                    sender.balance,
                ),
            );
        }
        store.account.set(this.senderId, {
            ...sender,
            balance: new BigNum(balance.toString()).sub(10000000000).toString(),
        });

        return errors;
    }

    protected assetFromSync(raw: any): object | undefined {
        if (raw.tf_data) {
            // This line will throw if there is an error
            const data = raw.tf_data.toString('utf8');

            return { data };
        }

        return undefined;
    }
}
