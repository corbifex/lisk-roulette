import { FaucetTransaction } from './101_faucet_transaction';

export function doFaucetTransaction(address, publicKey, passphrase, name) {
  const transaction = {
    senderId: address,
    senderPublicKey: publicKey,
    amount: '0',
    fee: '0',
    recipientId: address,
    recipientPublicKey: publicKey,
    type: 101,
    timestamp: getTimestamp(),
    asset: {
      username: name
    }
  };

  const faucetTransaction = new FaucetTransaction(
    transaction,
  );
  faucetTransaction.sign(passphrase);

  return faucetTransaction.toJSON();
}

const getTimestamp = () => {
  const epoch = new Date(Date.UTC(2019, 9, 18, 17, 0, 0, 0)).toISOString();
  const timeAfterEpoch = Date.now() - Date.parse(epoch);
  return parseInt(timeAfterEpoch / 1000 );
};
