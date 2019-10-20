import { RouletteBetTransaction } from './1001_bet_roulette_transaction';
import { getTimeWithOffset } from './time';
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
    amount: new BigNum(amount).times('100000000').toString(),
    recipientId: '',
    timestamp: getTimeWithOffset(),
    fee: '0',
    type: 1001,
    asset: {
      field: relativeField
    },
    senderId: address,
    senderPublicKey: publicKey,
  };

  const rouletteTransaction = new RouletteBetTransaction(
    transaction,
  );
  rouletteTransaction.sign(passphrase, null);
  return rouletteTransaction.toJSON();
}
