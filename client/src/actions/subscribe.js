import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:1111');

export function subscribeToBlocks(cb) {
  socket.on('blocks', hash => cb(null, hash));
}

export function subscribeToResults(cb) {
  socket.on('results', results => cb(null, results));
}

export function subscribeToStatus(cb) {
  socket.on('status', status => cb(null, status));
}

export function subscribeToAddress(cb) {
  socket.on('balance', balance => cb(null, balance));
}
