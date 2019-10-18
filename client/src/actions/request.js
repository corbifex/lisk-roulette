export function requestBlocks(socket, cb) {
  socket.on('rblocks', res => cb(null, res));
  socket.emit('rblocks');
}

export function requestResult(block, socket, cb) {
  socket.on('result', res => cb(null, res));
}

export function requestStatus(socket, cb) {
  socket.on('rs', status => cb(null, status));
  socket.emit('rs');
}

export function requestAddress(address, socket, cb) {
  socket.on(address, account => cb(null, account));
  socket.emit('address', address);
}
