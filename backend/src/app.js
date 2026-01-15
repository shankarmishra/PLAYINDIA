const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const logger = require('./utils/logger');
const { getHealthMetrics } = require('./utils/health');

const app = express();

// Initialize Sentry (only if DSN is provided)
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const coachRoutes = require('./routes/coach.routes');
const teamRoutes = require('./routes/team.routes');
const tournamentRoutes = require('./routes/tournament.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const bookingRoutes = require('./routes/booking.routes');
const nearbyPlayersRoutes = require('./routes/nearby-players.routes');
const apiRoutes = require('./routes/api.routes');
const documentVerificationRoutes = require('./routes/document.verification.routes');
const vehicleVerificationRoutes = require('./routes/vehicle.verification.routes');
const bankVerificationRoutes = require('./routes/bank.verification.routes');
const addressRoutes = require('./routes/address.routes');
const verificationRoutes = require('./routes/verification.routes');

// Import error handler
const errorHandler = require('./middleware/error');

// Sentry request handler must be the first middleware (only if Sentry is initialized)
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn') {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
app.use(cors());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/nearby-players', nearbyPlayersRoutes);
app.use('/api', apiRoutes);
app.use('/api/verification', documentVerificationRoutes);
app.use('/api/vehicle-verification', vehicleVerificationRoutes);
app.use('/api/bank-verification', bankVerificationRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/verifications', verificationRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const metrics = await getHealthMetrics();
    res.status(metrics.status === 'healthy' ? 200 : 503).json({
      success: metrics.status === 'healthy',
      data: metrics
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handling middleware
if (process.env.SENTRY_DSN && process.env.SENTRY_DSN !== 'your_sentry_dsn') {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errorHandler);

module.exports = app;
