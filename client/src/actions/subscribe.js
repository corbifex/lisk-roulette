export function subscribeToBlocks(socket, cb) {
  socket.on('blocks', hash => cb(null, hash));
}

export function subscribeToResults(socket, cb) {
  socket.on('results', results => cb(null, results));
}

export function subscribeToStatus(socket, cb) {
  socket.on('status', status => cb(null, status));
}

export function subscribeToPeerBets(socket, cb) {
  socket.on('peerBets', bet => cb(null, bet));
}

export function subscribeToAddress(socket, cb) {
  socket.on('balance', balance => cb(null, balance));
}
