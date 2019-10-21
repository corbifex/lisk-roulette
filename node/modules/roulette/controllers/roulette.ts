import {BigNum} from 'lisk-sdk';

interface BetInterface {
    bet: number,
    amount: string,
}

interface TableInterface {
    fields: object;
    selectors: object;
    multiplier: object;
}

export class RouletteController {

    public readonly storage;
    public readonly draw: number;
    public readonly bet: BetInterface;
    public readonly senderId: string;
    public readonly table: TableInterface;
    public readonly socket;
    public won: boolean;

    constructor(draw, bet, address, storage, socket) {
        this.draw = draw;
        this.bet = bet;
        this.senderId = address;
        this.storage = storage;
        this.won = false;
        this.socket = socket;
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

    result() {
        // check won/lost
        if (this.bet.bet <= 36 && this.bet.bet === this.draw) {
            this.won = true;
        } else if (this.bet.bet > 36 &&
            this.bet.bet < 49 &&
            this.table.selectors[this.table.fields[this.bet.bet]].indexOf(this.draw) > -1) {
            this.won = true;
        }
    }

    multiplier() {
        if (this.bet.bet <= 36) {
            return 35;
        } else if (this.bet.bet > 36) {
            let betType = this.table.fields[this.bet.bet];
            return this.table.multiplier[betType];
        }
    }

    calculateProfit() {
       return new BigNum(this.bet.amount.toString()).mul(this.multiplier()).toString();
    }

    async commit(i: number) {
        this.result();
        console.log("commit 1.1", this.won)
        const gamblerAccount = await this.storage.entities.Account.get(
            {address: this.senderId}, {extended: true, limit: 1});
        if (this.won) {

            // commit profit to db
            const profit = this.calculateProfit();
            const newBalance = new BigNum(gamblerAccount[0].balance).add(profit).toString();
            console.log("commit 2.0.0")
            const updated = await this.storage.entities.Account.updateOne(
                {address: this.senderId},
                {
                    balance: newBalance,
                });
            console.log("commit 2.0.1")
            if (this.socket !== null) {
                this.socket.emit(gamblerAccount[0].address, {...gamblerAccount[0], balance: newBalance});
            }
            updated.push(i);
            return updated;
        } else {
            const newBalance = new BigNum(gamblerAccount[0].balance).sub(this.bet.amount).toString();
            console.log("commit 2.1.0")
            const updated = await this.storage.entities.Account.updateOne(
                {address: this.senderId},
                {
                    balance: newBalance,
                });
            console.log("commit 2.1.1")
            if (this.socket !== null) {
                this.socket.emit(gamblerAccount[0].address, {...gamblerAccount[0], balance: newBalance});
            }
            updated.push(i);
            return updated;
        }
    }
}
