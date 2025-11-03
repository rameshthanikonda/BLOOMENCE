import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

export async function connectRealtime() {
  const token = await getAuth().currentUser.getIdToken();
  const url = import.meta.env.VITE_SOCKET_URL || 'https://bloomence-mss1.onrender.com';
  const socket = io(url, {
    transports: ['websocket'],
    auth: { token },
  });

  const isDev = import.meta.env && import.meta.env.DEV;

  socket.on('connect', () => {
    if (isDev) console.log('[socket] connected');
  });
  socket.on('connect_error', (err) => {
    if (isDev) console.error('[socket] connect_error');
  });
  socket.on('disconnect', () => {
    if (isDev) console.warn('[socket] disconnect');
  });

  socket.on('email:sent', () => { if (isDev) console.log('[socket] email:sent'); });
  socket.on('auth:login', () => { if (isDev) console.log('[socket] auth:login'); });
  socket.on('result:saved', () => { if (isDev) console.log('[socket] result:saved'); });
  socket.on('result:highScoreAlert', () => { if (isDev) console.log('[socket] result:highScoreAlert'); });

  return socket;
}
