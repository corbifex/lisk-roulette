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
}
