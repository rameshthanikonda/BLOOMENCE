import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

export async function connectRealtime() {
  const token = await getAuth().currentUser.getIdToken();
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3002';
  const socket = io(url, {
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => console.log('[socket] connected', socket.id));
  socket.on('connect_error', (err) => console.error('[socket] connect_error', err.message));
  socket.on('disconnect', (reason) => console.warn('[socket] disconnect', reason));

  // Common events from backend
  socket.on('email:sent', (p) => console.log('[socket] email:sent', p));
  socket.on('auth:login', (p) => console.log('[socket] auth:login', p));
  socket.on('result:saved', (p) => console.log('[socket] result:saved', p));
  socket.on('result:highScoreAlert', (p) => console.log('[socket] result:highScoreAlert', p));

  return socket;
}
