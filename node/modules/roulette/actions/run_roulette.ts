import {BigNum} from 'lisk-sdk';
import Prando from 'prando';
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
                await syncingProcess(lastTransactions, 0, blockHash);

            }
    });

    async function syncingProcess(transactions, i, blockHash) {
        const rng = new Prando(blockHash);
        const draw = rng.nextInt(0, 36);
        const roulette = new RouletteController(draw, {
            amount: new BigNum(transactions[i].amount),
            bet: parseInt(transactions[i].asset.data)
        }, transactions[i].senderId, components.storage, socket);
        console.log("commit1");
        const commit = await roulette.commit();
        console.log('result', commit)
        if (commit && transactions[i+1]) {
            syncingProcess(transactions, (i + 1), blockHash);
        }
    }

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
