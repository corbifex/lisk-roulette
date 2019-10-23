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
            }
        }
    });

    channel.subscribe('chain:blocks:change', async event => {
        const lastBlock = await components.storage.entities.Block.get(
            {id: event.data.id}, {extended: true, limit: 1});
        socket.emit('results', lastBlock[0]);
    });

    channel.subscribe('roulette:update:balance', async event => {
        socket.emit(event.data.address, {balance: event.data.balance});
    });
};
