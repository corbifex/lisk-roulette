import {BigNum} from 'lisk-sdk';
import Prando from "prando";

export interface BetsInterface extends Array<Bet> {}

interface Bet {
    field: number,
    amount: string,
}

interface TableInterface {
    fields: Array<string|number>;
    selectors: object;
    multiplier: object;
}

export class RouletteController {

    public readonly storage;
    public readonly bet: BetsInterface;
    public readonly table: TableInterface;
    public readonly draw: number;
    public readonly socket;
    private readonly min = 0;
    private readonly max = 36;

    constructor(bet: BetsInterface, seed) {
        this.draw = this.getDraw(seed);
        this.bet = bet;
        this.table = {
            fields: [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                28, 29, 30, 31, 32, 33, 34, 35, 36, 'row1', 'row2', 'row3',
                'first', 'second', 'third', 'half1', 'even', 'red', 'black', 'odd', 'half2'
            ],
            selectors: {
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
            },
            multiplier: {
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
            }
        };
    }

    getDraw(seed: string): number {
        const rng = new Prando(seed);
        return rng.nextInt(this.min, this.max);
    }

    result(field) {
        // check won/lost
        if (field <= 36 && field === this.draw) {
            return true;
        } else if (field > 36 &&
            field < 49 &&
            this.table.selectors[this.table.fields[field]].indexOf(this.draw) > -1) {
            return true;
        }
        return false;
    }

    multiplier(field) {
        if (field <= 36) {
            return 35;
        } else if (field > 36) {
            return this.table.multiplier[this.table.fields[field]];
        }
    }

    profit() {
        let profit = new BigNum(0);
        this.bet.map(bet => {
            const fieldInt = new BigNum(bet.field).toInt();
            if (this.result(fieldInt)) {
                const amount = new BigNum(bet.amount).mul(10 ** 8);
                const subProfit = new BigNum(amount).mul(this.multiplier(fieldInt)).add(amount);
                profit = profit.add(subProfit);
            }
        });
        return profit.toString();
    }
}
