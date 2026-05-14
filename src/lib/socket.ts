import { io, Socket } from 'socket.io-client';

// In development, the socket connects to the same host/port.
// In production, it also connects to the relative path.
const socket: Socket = io(window.location.origin, {
  autoConnect: false,
});

export default socket;
