import {BigNum} from '@liskhq/bignum';
import {getAddressFromPublicKey} from '@liskhq/lisk-cryptography';
import {
  BaseTransaction,
  TransactionError,
  utils,
} from '@liskhq/lisk-transactions';

export class RouletteBetTransaction extends BaseTransaction {

  static TYPE = 1001;
  static FEE = '0';

  constructor(rawTransaction) {
    super(rawTransaction);
    const tx = (typeof rawTransaction === 'object' && rawTransaction !== null
      ? rawTransaction
      : {});
    // Initializes to empty object if it doesn't exist
    this.asset = (tx.asset || {});
  }


  async prepare(store) {
    await store.account.cache([{address: this.senderId}]);
  }

  verifyAgainstTransactions() {
    return [];
  }

  assetToBytes() {
    const { data } = this.asset;

    return data ? Buffer.from(data, 'utf8') : Buffer.alloc(0);
  }

  validateAsset() {
    const errors = [];
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

  applyAsset(store) {
    const errors = [];
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
      balance: balance.min(this.amount).toString(),
    });

    return errors;
  }

  undoAsset(store){
    const errors = [];
    const sender = store.account.getOrDefault(this.senderId);
    const balance = new BigNum(sender.balance);

    store.account.set(this.senderId, {
      ...sender,
      balance: balance.add(this.amount).toString(),
    });

    return errors;
  }

  assetFromSync(raw){
    if (raw.tf_data) {
      // This line will throw if there is an error
      const data = raw.tf_data.toString('utf8');

      return { data };
    }

    return undefined;
  }
}
