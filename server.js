const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const uploadRoutes = require("./routes/uploadRoutes");

const authRoutes = require('./routes/auth');
const missingRoutes = require('./routes/missing');
const foundRoutes = require('./routes/found');
const donationRoutes = require('./routes/donation');

const app = express();
const passport = require('passport');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(passport.initialize());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure passport strategies (no-op if env vars are missing)
try{
  require('./config/passport')()
}catch(err){
  console.error('Failed to configure passport:', err.message)
}

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/missing', missingRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/donations', donationRoutes);
app.use("/api/uploads", uploadRoutes);

// Error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
});

// Make io available to routes/controllers via app
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
