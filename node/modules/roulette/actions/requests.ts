export default ({components}, socket) => {
    socket.on('rs', async () => {
        socket.emit('rs', 3);
    });

    socket.on('rb', async () => {
        const lastBlock = await components.storage.entities.Block.get({}, {sort: 'height:desc', limit: 1});
        socket.emit('rb', lastBlock[0].id);
    });

    socket.on('results', async () => {
        const lastBlocks = await components.storage.entities.Block.get({numberOfTransactions_gt: 0}, {sort: 'height:desc', limit: 30, extended: true});
        if (lastBlocks.length > 0) {
            for (let b = 0; b < lastBlocks.length; b++) {
                if (lastBlocks[b].numberOfTransactions > 0) {
                    let transactions: any = [];
                    for (let i = 0; i < lastBlocks[b].numberOfTransactions; i++) {
                        const user = await components.storage.entities.Account.get(
                            {address: lastBlocks[b].transactions[i].senderId}, {extended: true});
                        transactions = [...transactions, {...lastBlocks[b].transactions[i], username: user.username}];
                    }
                    lastBlocks[b].transactions = transactions;
                }
            }
        }
        socket.emit('results', lastBlocks);
    });

    socket.on('rblocks', async () => {
        const lastBlocks = await components.storage.entities.Block.get({}, {sort: 'height:desc', limit: 30});
        let blocks: any = [];
        for (let i = 0; i < lastBlocks.length; i++) {
            blocks.push(lastBlocks[i].blockSignature);
        }
        socket.emit('rblocks', blocks);
    });

    socket.on('request:full:blocks', async () => {
        const lastBlocks = await components.storage.entities.Block.get({}, {sort: 'height:desc', limit: 30});
        socket.emit('request:full:blocks', lastBlocks);
    });

    socket.on('address', async (address) => {
        const account = await components.storage.entities.Account.get({address: address}, {limit: 1});
        socket.emit(address, account[0]);
    });

    socket.on('tx', async (id) => {
        const tx = await components.storage.entities.Transaction.get({id: id}, {limit: 1, extended: true});
        const block = await components.storage.entities.Block.get({id: tx[0].blockId}, {limit: 1});
        socket.emit(id, { ...tx[0], seed: block[0].blockSignature});
    });

    socket.on('username', async (username) => {
        const account = await components.storage.entities.Account.get({username: username}, {limit: 1, extended: true});
        socket.emit(username, !!account[0]);
    });

    socket.on('get_username', async (address) => {
        const account = await components.storage.entities.Account.get({address: address}, {limit: 1, extended: true});
        socket.emit(`user_${address}`, account[0].username);
    });
}
