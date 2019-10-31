export function requestBlocks(socket, cb) {
  socket.on('rblocks', res => cb(null, res));
  socket.emit('rblocks');
}

export function requestResult(socket) {
  socket.emit('results');
}

export function requestStatus(socket, cb) {
  socket.on('rs', status => cb(null, status));
  socket.emit('rs');
}

export function requestAddress(address, socket, cb) {
  socket.on(address, account => cb(null, account));
  socket.emit('address', address);
}

export function requestMyBets(address, socket, cb) {
  socket.on(`my_results_${address}`, account => cb(null, account));
  socket.emit('my_results', address);
}

export function requestTx(id, socket, cb) {
  socket.on(id, tx => cb(null, tx));
  socket.emit('tx', id);
}

export function requestTopList(socket) {
  socket.emit('topList');
}

export function requestStats(socket) {
  socket.emit('stats_all');
}

export function hasUsername(username, socket, cb) {
  socket.on(username, tx => cb(null, tx));
  socket.emit('username', username);
}
