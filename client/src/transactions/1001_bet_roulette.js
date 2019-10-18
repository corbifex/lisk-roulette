import { RouletteBetTransaction } from './1001_bet_roulette_transaction';
const BigNum = require('bignumber.js');
const fields = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 'row1', 'row2', 'row3',
  'first', 'second', 'third', 'half1', 'even', 'red', 'black', 'odd', 'half2'
];
export function doRouletteBetTransaction(amount, field, address, publicKey, passphrase) {
  let relativeField = fields.indexOf(field);
  if (relativeField === -1) {
    relativeField = fields.indexOf(parseInt(field));
  }
  const transaction = {
    senderId: address,
    senderPublicKey: publicKey,
    amount: new BigNum(amount).times('100000000').toString(),
    fee: '0',
    recipientId: address,
    recipientPublicKey: publicKey,
    type: 1001,
    asset: {
      field: relativeField
    },
    timestamp: getTimestamp(),
  };

  const rouletteTransaction = new RouletteBetTransaction(
    transaction,
  );
  rouletteTransaction.sign(passphrase);
  return rouletteTransaction.toJSON();
}

const getTimestamp = () => {
  const epoch = new Date(Date.UTC(2019, 9, 18, 0, 0, 0, 0)).toISOString();
  const timeAfterEpoch = Date.now() - Date.parse(epoch);
  return parseInt(timeAfterEpoch / 1000 );
};
