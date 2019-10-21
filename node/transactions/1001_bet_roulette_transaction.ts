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

export interface RouletteAsset {
    readonly data: string;
}

export const rouletteAssetFormatSchema = {
    type: 'object',
    properties: {
        data: {
            type: 'string',
            min: 0,
            max: 48
        },
    },
};

export class BetRouletteTransaction extends BaseTransaction {
    public readonly asset: RouletteAsset;
    public static TYPE = 1001;
    public static FEE = '0';

    public constructor(rawTransaction: unknown) {
        super(rawTransaction);
        const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
            ? rawTransaction
            : {}) as Partial<TransactionJSON>;
        // Initializes to empty object if it doesn't exist
        this.asset = (tx.asset || {}) as RouletteAsset;
    }

    public async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([{address: this.senderId}]);
    }

    protected verifyAgainstTransactions(
        _: ReadonlyArray<TransactionJSON>,
    ): ReadonlyArray<TransactionError> {
        return [];
    }

    protected assetToBytes(): Buffer {
        const { data } = this.asset;

        return data ? Buffer.from(data, 'utf8') : Buffer.alloc(0);
    }

    protected validateAsset(): ReadonlyArray<TransactionError> {
        utils.validator.validate(rouletteAssetFormatSchema, this.asset);
        const errors = convertToAssetError(
            this.id,
            utils.validator.errors,
        ) as TransactionError[];
        if (this.amount.lt(100000000)) {
            errors.push(
                new TransactionError(
                    'Amount must be at least 1 to bet',
                    this.id,
                    '.amount',
                    this.amount.toString(),
                    '0',
                ),
            );
        }

        if (!this.senderId) {
            errors.push(
                new TransactionError(
                    '`rsenderId` must be provided.',
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
        if (balance.lt(this.amount)) {
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
            balance: balance.sub(this.amount).toString(),
        });

        return errors;
    }

    protected undoAsset(store: StateStore): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
        const sender = store.account.getOrDefault(this.senderId);
        const balance = new BigNum(sender.balance);

        store.account.set(this.senderId, {
            ...sender,
            balance: balance.add(this.amount).toString(),
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
