const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Import Routes and Middleware ---
const resultsRoutes = require('./routes/results');
const geminiRoutes = require('./routes/gemini');
const { verifyToken, admin } = require('./middleware/auth'); // ✅ fixed
const notificationsRoutes = require('./routes/notifications');
const { startNotificationsScheduler } = require('./jobs/scheduler');

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use(express.json());

// --- Routes ---
app.use('/api/results', verifyToken, resultsRoutes); // ✅ fixed
app.use('/api/gemini', verifyToken, geminiRoutes);   // ✅ fixed
app.use('/api/notifications', verifyToken, notificationsRoutes);

// Basic test route
app.get('/', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).send('Backend is running and MongoDB is READY.');
  } else {
    res.status(503).send('Backend is running, but MongoDB connection failed.');
  }
});

// --- Realtime ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

io.use(async (socket, next) => {
  try {
    const authHeader = socket.handshake.auth && socket.handshake.auth.token
      ? `Bearer ${socket.handshake.auth.token}`
      : socket.handshake.headers && socket.handshake.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next(new Error('unauthorized'));
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    socket.data.user = decoded;
    socket.join(decoded.uid);
    return next();
  } catch (e) {
    return next(e);
  }
});

io.on('connection', () => { });

app.set('io', io);

// --- Server Start ---
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
startNotificationsScheduler();