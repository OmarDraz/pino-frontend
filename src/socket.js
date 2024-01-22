import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  upgrade: false,
  withCredentials: true,
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});


export default socket

