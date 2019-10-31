export default ({components, channel}, socket) => {
    channel.subscribe('chain:blocks:change', async event => {
        socket.emit('blocks', event.data.blockSignature);
        const lastActions = await components.storage.entities.Transaction.get(
            {blockId: event.data.id}, {extended: true});
        for (let i = 0; i < lastActions.length; i++) {
            if (lastActions[i].type === 101) {
                const faucetAccount = await components.storage.entities.Account.get(
                    {address: lastActions[i].senderId}, {extended: true, limit: 1});
                socket.emit(lastActions[i].senderId, faucetAccount[0]);
            } else if (lastActions[i].type === 1001) {
                socket.emit('peerBets', {
                    address: lastActions[i].senderId,
                    id: lastActions[i].id,
                    bet: lastActions[i].asset.data,
                    timestamp: lastActions[i].timestamp,
                    seed: event.data.blockSignature,
                });
                socket.emit(`bet_${lastActions[i].id}`, {tx: lastActions[i], seed: event.data.blockSignature});
            }
        }
    });

    channel.subscribe('chain:blocks:change', async event => {
        const lastBlock = await components.storage.entities.Block.get(
            {id: event.data.id}, {extended: true, limit: 1});
        if (lastBlock[0].numberOfTransactions > 0) {
            let transactions: any = [];
            for (let i = 0; i < lastBlock[0].numberOfTransactions; i++) {
                const user = await components.storage.entities.Account.get(
                    {address: lastBlock[0].transactions[i].senderId}, {extended: true});
                transactions = [...transactions, {...lastBlock[0].transactions[i], username: user[0].username}];
            }
            socket.emit('results', {...lastBlock[0], transactions: transactions});
        }
    });

    channel.subscribe('roulette:update:balance', async event => {
        socket.emit(event.data.address, {balance: event.data.balance});
    });

    channel.subscribe('roulette:update:stats_all', async () => {
        const stats = await components.storage.entities.GlobalStats.get({type: 'all'}, {limit: 1});
        socket.emit('stats_all', stats[0]);
    });

    channel.subscribe('roulette:update:topList', async () => {
        const topBalance = await components.storage.entities.Account.get({}, {limit: 22, sort: "balance:desc"});
        let topBalanceFull: Array<any> = [];
        for (let i = 0; i < topBalance.length; i++) {
            if (topBalance[i].username !== 'moosty' && topBalance[i].username.substr(0, 8) !== 'genesis_') {
                topBalanceFull.push({
                    ...topBalance[i],
                });
            }
        }
        const topWin = await components.storage.entities.UserStats.get({}, {limit: 15, sort: "wins:desc"});
        let topWinFull: Array<any> = [];
        for (let i = 0; i < topWin.length; i++) {
            topWinFull.push({
                ...topWin[i],
                username: (await components.storage.entities.Account.get({address: topWin[i].accountId}, {limit: 1}))[0].username
            });
        }
        const topBets = await components.storage.entities.UserStats.get({}, {limit: 15, sort: "bets:desc"});
        let topBetsFull: Array<any> = [];
        for (let i = 0; i < topBets.length; i++) {
            topBetsFull.push({
                ...topBets[i],
                username: (await components.storage.entities.Account.get({address: topBets[i].accountId}, {limit: 1}))[0].username
            });
        }
        socket.emit('topList', {balance: topBalanceFull, win: topWinFull, bets: topBetsFull});
    });
};
