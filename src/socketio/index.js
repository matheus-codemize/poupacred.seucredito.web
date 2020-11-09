import io from 'socket.io-client';

const options = {
  reconnection: false,
  reconnectionDelay: 5000,
  reconnectionAttempts: 100,
  reconnectionDelayMax: 10000,
  // transports: ['websocket'],
};

const socket = io(process.env.REACT_APP_API_URL, options);

socket.on('connect', () => {
  console.log('Conectado:', socket.connected);
});

export default socket;
