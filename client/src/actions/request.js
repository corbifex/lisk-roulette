import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:1111');

export function requestBlocks(cb) {
  socket.on('rblocks', res => cb(null, res));
  socket.emit('rblocks');
}

export function requestResult(block, cb) {
  socket.on('result', res => cb(null, res));
}

export function requestStatus(cb) {
  socket.on('rs', status => cb(null, status));
  socket.emit('rs');
}

export function requestAddress(address, cb) {
  socket.on('address', balance => cb(null, balance));
}
