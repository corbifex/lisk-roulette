import {BigNum} from 'lisk-sdk';
import _ from 'lodash';
import {RouletteController} from '../controllers/roulette';

export default ({components, channel}, socket) => {
    channel.subscribe('chain:blocks:change', async event => {
        const blockHash = event.data.blockSignature;
        if (socket !== null) {
            socket.emit('blocks', event.data.blockSignature);
            setTimeout(() => {
                socket.emit('status', 2);
            }, 2100);
            setTimeout(() => {
                socket.emit('status', 0);
            }, 8000);
            setTimeout(() => {
                socket.emit('status', 1);
            }, 35000);
        }
        // Get transactions ready for roulette result
        const lastTransactions = await components.storage.entities.Transaction.get(
            {blockId: event.data.id, type: 1001}, {extended: true});

        if (lastTransactions.length > 0) {
            // Loop through transactions
            let profits = {};
            for (let i = 0; i < lastTransactions.length; i++) {
                const roulette = new RouletteController({
                    amount: new BigNum(lastTransactions[i].amount),
                    bet: parseInt(lastTransactions[i].asset.data)
                }, blockHash);
                if (new BigNum(roulette.profit()).gt(0)) {
                    profits[lastTransactions[i].senderId] = profits[lastTransactions[i].senderId] ?
                        new BigNum(profits[lastTransactions[i].senderId]).add(roulette.profit()) : new BigNum(roulette.profit());
                }
            }

            const profitList = _.map(profits, (profit, address) => {
                return {address: address, profit: profit};
            });
            for (let i = 0; i < profitList.length; i++) {
                const gamblerAccount = await components.storage.entities.Account.get(
                    {address: profitList[i].address}, {extended: true, limit: 1});
                const newBalance = new BigNum(gamblerAccount[0].balance).add(profitList[i].profit).toString();
                await components.storage.entities.Account.updateOne({address: profitList[i].address}, {balance: newBalance});
            }
        }
    });

    channel.subscribe('chain:blocks:change', async event => {
        const lastFaucetActions = await components.storage.entities.Transaction.get(
            {blockId: event.data.id, type: 101}, {extended: true});
        for (let i = 0; i < lastFaucetActions.length; i++) {
            if (socket !== null) {
                const faucetAccount = await components.storage.entities.Account.get(
                    {address: lastFaucetActions[i].senderId}, {extended: true, limit: 1});
                socket.emit(lastFaucetActions[i].senderId, faucetAccount[0]);
            }
        }
    });

    channel.subscribe('chain:transactions:change', async event => {
        if (socket !== null) {
            if (event.data.type === 1001) {
                socket.emit('peerBets', {
                    address: event.data.senderId,
                    id: event.data.id,
                    amount: event.data.amount,
                    field: event.data.asset.data,
                    timestamp: event.data.timestamp
                });
            }
        }
    });

};
