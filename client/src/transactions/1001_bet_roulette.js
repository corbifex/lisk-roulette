import { RouletteBetTransaction } from './1001_bet_roulette_transaction';
import { getTimeWithOffset } from './time';

const BigNum = require('bignumber.js');
export const fields = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 'row1', 'row2', 'row3', 'first', 'second', 'third', 'half1', 'even', 'red', 'black',
  'odd', 'half2'
];

export const selectors = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
  first: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  second: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  third: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  row3: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  row2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  row1: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  half1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  half2: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  odd: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
  even: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
};
export const multiplier = {
  red: 1,
  black: 1,
  first: 2,
  second: 2,
  third: 2,
  row1: 2,
  row2: 2,
  row3: 2,
  half1: 1,
  half2: 1,
  odd: 1,
  even: 1,
};

export function doRouletteBetTransaction(amount, bet, address, publicKey, passphrase) {
  const bets = bet.map(b => {
    const relativeField = fields.indexOf(b.field);
    if (relativeField > -1) {
      b.field = relativeField;
    }
    return b
  });
  const transaction = {
    amount: new BigNum(amount).times(10 ** 8).toString(),
    recipientId: '',
    timestamp: getTimeWithOffset(),
    fee: '0',
    type: 1001,
    asset: {
      data: JSON.stringify(bets)
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
