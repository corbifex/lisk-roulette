import {BigNum} from 'lisk-sdk';
import {getAddressFromPublicKey} from '@liskhq/lisk-cryptography';
import {
    BaseTransaction,
    StateStorePrepare,
    TransactionError,
    StateStore,
    utils,
    TransactionJSON
} from '@liskhq/lisk-transactions';

export class FaucetTransaction extends BaseTransaction {

    public static TYPE = 101;
    public static FEE = '0';

    public async prepare(store: StateStorePrepare): Promise<void> {
        await store.account.cache([{address: this.senderId}]);
    }

    protected verifyAgainstTransactions(
        _: ReadonlyArray<TransactionJSON>,
    ): ReadonlyArray<TransactionError> {
        return [];
    }

    protected validateAsset(): ReadonlyArray<TransactionError> {
        const errors: TransactionError[] = [];
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
        store.account.set(this.senderId, {
            ...sender,
            balance: new BigNum(10000000000).toString(),
        });

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
