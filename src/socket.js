import io from 'socket.io-client';

const socket = io(process.env.BACKEND_HOST, {
  transports: ['websocket'],
  upgrade: false,
  withCredentials: true,
  cors: {
    origin: process.env.FRONTEND_HOST,
    methods: ['GET', 'POST'],
  },
});


export default socket

