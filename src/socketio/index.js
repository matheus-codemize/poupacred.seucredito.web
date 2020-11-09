import io from 'socket.io-client';

const options = {
  // reconnection: false,
  // reconnectionDelay: 5000,
  // reconnectionAttempts: 100,
  // reconnectionDelayMax: 10000,
  transports: ['websocket'],
};

const socket = io(process.env.REACT_APP_API_URL);

socket.on('connect', () => {
  console.log('socket conectado', socket.connected);
});

export default socket;
