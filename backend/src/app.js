const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });

const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const webhookRoutes = require('./routes/webhook');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production security if needed
    methods: ['GET', 'POST']
  }
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Trust proxy for HTTPS/SSL termination
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Socket Auth Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.user.id} (Company: ${socket.user.company_id})`);
  
  // Join private room based on userId for targetted notifications
  socket.join(`user_${socket.user.id}`);
  
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.user.id}`);
  });
});

// Attached io to app for use in controllers
app.set('io', io);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://app.tricityverified.com',
  'https://tricityverified.com',
  'https://www.tricityverified.com',
  'https://crm-one-red.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    const isLocalNetwork = origin.startsWith('http://192.168.') || origin.startsWith('http://10.');
    if (process.env.NODE_ENV !== 'production' && isLocalNetwork) {
      return callback(null, true);
    }
    var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the public/uploads directory with CORS enabled for PDF generation
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  next();
}, express.static(path.join(process.cwd(), 'public/uploads')));



// Routes
app.use('/api/super', require('./routes/superAdmin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/webhook', require('./routes/webhook'));
app.use('/api/call-logs', require('./routes/callLogs'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/follow-ups', require('./routes/followUps'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/outbound-leads', require('./routes/outboundLeads'));
app.use('/api/blacklist', require('./routes/blacklist'));
app.use('/api/retry-queue', require('./routes/retryQueue'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/communications', require('./routes/communications'));
app.use('/api/auto-response-settings', require('./routes/autoResponseSettings'));
app.use('/api/telephony', require('./routes/telephony'));

// New Features (Phase 1 & 2)
app.use('/api/lottery', require('./routes/lottery'));
app.use('/api/developer', require('./routes/developer'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/live-calls', require('./routes/liveCalls'));
app.use('/api/attendance', attendanceRoutes);
app.use('/v1', require('./routes/v1'));

Sentry.setupExpressErrorHandler(app);

// Health check
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date(),
      env: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(503).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: err.message,
      timestamp: new Date()
    });
  }
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Backend server (with Socket.io) running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
