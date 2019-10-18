import {BigNum} from '@liskhq/bignum';
import {getAddressFromPublicKey} from '@liskhq/lisk-cryptography';
import {
  BaseTransaction,
  TransactionError,
  utils,
} from '@liskhq/lisk-transactions';

export class FaucetTransaction extends BaseTransaction {

  static TYPE = 101;
  static FEE = '0';

  async prepare(store) {
    await store.account.cache([{address: this.senderId}]);
  }

  verifyAgainstTransactions() {
    return [];
  }

  validateAsset() {
    const errors = [];
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

  applyAsset(store) {
    const errors = [];
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

  undoAsset(store) {
    const errors = [];
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

  assetFromSync(raw) {
    if (raw.tf_data) {
      // This line will throw if there is an error
      const data = raw.tf_data.toString('utf8');

      return { data };
    }

    return undefined;
  }
}
