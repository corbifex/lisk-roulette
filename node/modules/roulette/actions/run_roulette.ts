import {BigNum} from 'lisk-sdk';
import _ from 'lodash';
import {RouletteController} from '../controllers/roulette';
let signatureCache: any = [];
export default ({components, channel}) => {
    channel.subscribe('chain:blocks:change', async event => {
        const blockHash = event.data.blockSignature;
        if (signatureCache.indexOf(blockHash) === -1) {
            signatureCache.push(blockHash);

            // Get transactions ready for roulette result
            const lastTransactions = await components.storage.entities.Transaction.get(
                {blockId: event.data.id, type: 1001}, {extended: true});

            if (lastTransactions.length > 0) {
                // Loop through transactions
                let profits = {};
                for (let i = 0; i < lastTransactions.length; i++) {
                    const roulette = new RouletteController(JSON.parse(lastTransactions[i].asset.data), blockHash);
                    const profit = roulette.profit();
                    if (new BigNum(profit).gt(0)) {
                        profits[lastTransactions[i].senderId] = profits[lastTransactions[i].senderId] ?
                            new BigNum(profits[lastTransactions[i].senderId]).add(profit) : new BigNum(profit);
                    }
                }

                const profitList = _.map(profits, (profit, address) => {
                    return {address: address, profit: profit};
                });
                for (let i = 0; i < profitList.length; i++) {
                    const gamblerAccount = await components.storage.entities.Account.get(
                        {address: profitList[i].address}, {extended: true, limit: 1});
                    const newBalance = new BigNum(gamblerAccount[0].balance).add(profitList[i].profit);
                    await components.storage.entities.Account.updateOne({address: profitList[i].address}, {balance: newBalance.toString()});
                    channel.publish('roulette:update:balance', {address: profitList[i].address, balance: newBalance.toString()});
                }
            }
        }
    });
};
