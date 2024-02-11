import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_UR, {
  transports: ['websocket'],
  upgrade: false,
  withCredentials: true,
  cors: {
    origin: process.env.REACT_APP_CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});


export default socket

