import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middlewares.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middlewares.js';
import workFlowRouter from './routes/workFlow.routes.js';
import { setupNotificationScheduler } from './services/notificationScheduler.js';
import passport from './config/passport.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Passport initialization (for OAuth strategies)
app.use(passport.initialize());

app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflow', workFlowRouter);

// Backwards-compatible aliases (shorter paths) so clients using /api/... keep working
app.use('/api/auth', authRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/workflow', workFlowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  await connectDB();
  setupNotificationScheduler();
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    // Try a fallback port (PORT + 1) to avoid crashing in development when the port is busy.
    const fallback = Number(PORT || 0) + 1 || 0;
    // eslint-disable-next-line no-console
    console.warn(`Port ${PORT} is in use. Attempting to listen on fallback port ${fallback}...`);
    server.listen(fallback);
  } else {
    // eslint-disable-next-line no-console
    console.error('Server error:', err);
    process.exit(1);
  }
});
export default app;