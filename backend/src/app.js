const path = require('path');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: path.resolve(process.cwd(), envFile) });

const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const webhookRoutes = require('./routes/webhook');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

// Trust proxy for HTTPS/SSL termination (needed for secure cookies)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://app.tricityverified.com',
  'https://tricityverified.com',
  'https://www.tricityverified.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // 2. Allow specific whitelisted origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // 3. Dynamic: Allow any local network IP (192.168.x.x or 10.x.x.x) during development
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

// The error handler must be BEFORE any other error middleware and AFTER all controllers
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

app.listen(PORT, HOST, () => {
  console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
