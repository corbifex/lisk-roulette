import Prando from 'prando';
import fs from 'fs';
import {BigNum} from 'lisk-sdk';
import {RouletteController} from "./roulette";

const chiSquaredTest = require('chi-squared-test');

export class StatsController {

    protected storage;
    protected channel;

    constructor(storage, channel) {
        this.storage = storage;
        this.channel = channel;
    }

    syncStats() {
        this.updateBets();
        this.syncUserStats();
        this.syncGlobalStats();
    }

    async syncUserStats() {
        const userCount = await this.storage.entities.Account.count();
        // go through users 100 at a time
        for (let offset = 0; offset < userCount; offset = offset + 100) {
            const users = await this.storage.entities.Account.get({}, {limit: 100, offset: offset});
            for (let nUser = 0; nUser < users.length; nUser++) {
                let lastTx = 0;
                let currentStats = await this.storage.entities.UserStats.get({accountId: users[nUser].address}, {limit: 1});
                if (currentStats.length === 0) {
                    const firstTx = await this.storage.entities.Transaction.get({senderId: users[nUser].address}, {
                        sort: 'timestamp:asc',
                        limit: 1
                    });
                    if (firstTx && firstTx.length > 0 && firstTx[0].timestamp) {
                        await this.storage.entities.UserStats.create(users[nUser].address, firstTx[0].timestamp);
                        currentStats = [
                            {
                                accountId: users[nUser].address,
                                bets: 0,
                                wins: 0,
                                payout: 0,
                                wagered: 0,
                                lastTx: 0,
                                registered: firstTx[0].timestamp,
                            }
                        ];
                    }
                }
                if (currentStats[0] && currentStats[0].lastTx) {
                    lastTx = currentStats[0].lastTx;
                }
                const bets = await this.storage.entities.Transaction.get({
                    senderId: users[nUser].address,
                    type: 1001,
                    timestamp_gt: lastTx
                }, {limit: 1000, extended: true});
                if (bets !== null && bets.length > 0) {
                    // new bets found calculate existing fields
                    let wagered = new BigNum(currentStats[0].wagered);
                    let payout = new BigNum(currentStats[0].payout);
                    let betsCount = new BigNum(currentStats[0].bets);
                    let wins = new BigNum(currentStats[0].wins);
                    let lastTxTimestamp = currentStats[0].lastTx;
                    for (let nBet = 0; nBet < bets.length; nBet++) {
                        // check win, payout
                        const block = await this.storage.entities.Block.get({id: bets[nBet].blockId}, {limit: 1});
                        const rouletteController = new RouletteController(JSON.parse(bets[nBet].asset.data), block[0].blockSignature);
                        const profit = rouletteController.profit();
                        wagered = wagered.add(bets[nBet].amount);
                        betsCount = betsCount.add(1);
                        lastTxTimestamp = bets[nBet].timestamp;
                        payout = payout.add(profit);
                        if (new BigNum(profit).gte(bets[nBet].amount)) {
                            wins = wins.add(1);
                        }
                    }
                    await this.storage.entities.UserStats.updateOne(betsCount.toString(), wins.toString(), payout.toString(), wagered.toString(), users[nUser].address, new BigNum(lastTxTimestamp).toString());
                }
            }
        }
        this.channel.publish('roulette:update:topList');
        setTimeout(() => {
            this.syncUserStats();
        },60000);
    }

    async syncGlobalStats() {
        const globalStats = await this.storage.entities.GlobalStats.get({type: 'all'}, {limit: 1});
        const bets = await this.storage.entities.Transaction.get({
            type: 1001,
            timestamp_gt: globalStats[0].height
        }, {limit: 1000, extended: true});
        if (bets !== null && bets.length > 0) {
            // new bets found calculate existing fields
            let wagered = new BigNum(globalStats[0].wagered);
            let payout = new BigNum(globalStats[0].payout);
            let betsCount = new BigNum(globalStats[0].bets);
            let wins = new BigNum(globalStats[0].wins);
            let lastTxTimestamp = globalStats[0].height;
            for (let nBet = 0; nBet < bets.length; nBet++) {
                // check win, payout
                const block = await this.storage.entities.Block.get({id: bets[nBet].blockId}, {limit: 1});
                const rouletteController = new RouletteController(JSON.parse(bets[nBet].asset.data), block[0].blockSignature);
                const profit = rouletteController.profit();
                wagered = wagered.add(bets[nBet].amount);
                betsCount = betsCount.add(1);
                lastTxTimestamp = bets[nBet].timestamp;
                payout = payout.add(profit);
                if (new BigNum(profit).gte(bets[nBet].amount)) {
                    wins = wins.add(1);
                }
            }
            await this.storage.entities.GlobalStats.updateOne(betsCount.toString(), wins.toString(), payout.toString(), wagered.toString(), 'all', new BigNum(lastTxTimestamp).toString());
            this.syncGlobalStats();
        }
        this.channel.publish('roulette:update:stats_all');
        setTimeout(() => {
            this.syncGlobalStats();
        },60000);
    }

    async updateBets() {
        const lastBetsUpdate = parseInt((await this.storage.entities.Bets.getLast()).height);
        const lastDBBlock = (await this.storage.entities.Block.get({}, {sort: "height:desc", limit: 1}))[0].height;
        if (lastBetsUpdate < lastDBBlock) {
            let lastUpdatedBlock = lastBetsUpdate;
            let bets = await this.storage.entities.Bets.get({}, {limit: 37});
            for (let i = lastBetsUpdate; i < lastDBBlock; i = i + 1000) {
                const blocks = await this.storage.entities.Block.get({
                    height_gt: i,
                    height_lt: lastDBBlock
                }, {sort: "height:asc", limit: 1000});
                for (let b = 0; b < blocks.length; b++) {
                    const rng = new Prando(blocks[b].blockSignature);
                    const luckyNumber = rng.nextInt(0, 36);
                    bets[luckyNumber].count = parseInt(bets[luckyNumber].count) + 1;
                    lastUpdatedBlock = blocks[b].height;
                }
            }

            for (let i = 0; i < bets.length; i++) {
                await this.storage.entities.Bets.updateOne(i, bets[i].count, lastUpdatedBlock);
            }
        }
        setTimeout(() => {
            this.updateBets()
        }, 60000);
    }

    async chiSquareTest() {
        const lastDBBlock = (await this.storage.entities.Block.get({}, {sort: "height:desc", limit: 1}))[0].height;
        let lastUpdatedBlock = 0;
        let bets: Array<number> = new Array<number>(37).fill(0, 0, 37);
        fs.writeFileSync('./logs/numbers.txt', "# lisk-roulette rng\n # seed: 12345\n type: d\n");
        for (let i = 0; i < lastDBBlock; i = i + 1000) {
            const blocks = await this.storage.entities.Block.get({
                height_gt: i,
                height_lt: lastDBBlock
            }, {sort: "height:asc", limit: 1000});
            let numbers = "";
            for (let b = 0; b < blocks.length; b++) {
                const rng = new Prando(blocks[b].blockSignature);
                const luckyNumber = rng.nextInt(0, 36);
                numbers = `${numbers}\n${luckyNumber}`;
                bets[luckyNumber] = bets[luckyNumber] + 1;
                lastUpdatedBlock = blocks[b].height;
            }
            fs.appendFileSync("./logs/numbers.txt", numbers);
        }
        let expected: Array<number> = new Array<number>(37).fill(Math.round(lastUpdatedBlock / 37), 0, 37);
        return chiSquaredTest(bets, expected, 1);
    }

}
