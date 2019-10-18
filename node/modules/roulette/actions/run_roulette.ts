import {BigNum} from 'lisk-sdk';
import Prando from 'prando';
import {RouletteController} from '../controllers/roulette';

export default ({components, channel}, socket) => {
    channel.subscribe('chain:blocks:change', async event => {

        const blockHash = event.data.blockSignature;
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
        // Get transactions ready for roulette result
        const lastTransactions = await components.storage.entities.Transaction.get(
            {blockId: event.data.id, type: 1001}, {extended: true});

        if (lastTransactions.length > 0) {
            // Loop through transactions
            for (let i = 0; i < lastTransactions.length; i++) {
                const rng = new Prando(blockHash);
                const draw = rng.nextInt(0, 36);
                const gamblerAccount = await components.storage.entities.Account.get(
                    {address: lastTransactions[i].senderId}, {extended: true, limit: 1});
                const roulette = new RouletteController(draw, {
                    amount: new BigNum(lastTransactions[i].amount),
                    bet: parseInt(lastTransactions[i].asset.field)
                }, gamblerAccount, components.storage, socket);
                roulette.commit();
            }
        }
    });

    channel.subscribe('chain:blocks:change', async event => {
        const lastFaucetActions = await components.storage.entities.Transaction.get(
            {blockId: event.data.id, type: 101}, {extended: true});
        for (let i = 0; i < lastFaucetActions.length; i++) {
            const faucetAccount = await components.storage.entities.Account.get(
                {address: lastFaucetActions[i].senderId}, {extended: true, limit: 1});
            socket.emit(lastFaucetActions[i].senderId, faucetAccount[0]);
        }
    });

    channel.subscribe('chain:transactions:change', async event => {
        if (event.data.type === 1001) {
            socket.emit('peerBets', {
                address: event.data.senderId,
                id: event.data.id,
                amount: event.data.amount,
                field: event.data.asset.field,
                timestamp: event.data.timestamp
            });
        }
    });

};
