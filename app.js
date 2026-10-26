require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./src/routes');

const app = express();

// Dynamic CORS configuration allowing localhost, Cloud Workstations, Vercel, and custom domains
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, Render health checks)
    // and dynamically allow all browser origins (localhost, Cloud Workstations, Vercel, etc.)
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Enable CORS and preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// JSON body parsing
app.use(express.json());

// Root service-status endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Student Internship Portal API is running!',
  });
});

// Accurate health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (isDbConnected) {
    return res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(503).json({
    status: 'Service Unavailable',
    database: 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed by CORS' });
  }

  console.error('Server error encountered:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'An internal server error occurred. Please try again later.',
  });
});

// Connect to MongoDB and start the server
async function startServer(portOverride) {
  const mongoUri = process.env.MONGO_DB_URI;

  if (!mongoUri) {
    console.error(
      'Startup failure: MONGO_DB_URI environment variable is missing.'
    );
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    console.log('MongoDB connection established successfully.');

    const PORT = portOverride || process.env.PORT || 5000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is ready and listening on http://0.0.0.0:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error('MongoDB connection failed during startup:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
