import io from 'socket.io-client';

const options = { transports: ['websocket'] };
const socket = io(process.env.REACT_APP_API_URL);

socket.on('connect', connect);

function connect() {
  console.log('socket.io connectado');
}

export default socket;
