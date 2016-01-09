import socketCluster from 'socketcluster-client';
import socketOptions from '../constants/socketOptions';

let socket;
let channel;

export function subscribe(subscriber) {
  socket = socketCluster.connect(socketOptions);

  socket.emit('login', {}, (err, channelName) => {
    // TODO: process errors
    channel = socket.subscribe(channelName);
    channel.watch(subscriber);
  });
}

export function dispatchRemotely(action) {
  socket.emit('respond', { type: 'DISPATCH', action });
}
