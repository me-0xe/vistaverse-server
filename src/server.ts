import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import admin from './routes/api/admin';
import test from './routes/api/test';
import morgan from 'morgan';


dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
  console.error('No port defined');
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express(); // Create express server instance.

// Middleware (we can remove these if cause issues.)
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

// Routes
app.use('/api/admin', admin);
app.use('/api/test', test);


// @route   GET /
// @desc    Test Base API
// @access  Public
app.get('/', (_req, res) => {
  res.send('API Running');
});


app.use(errorMiddleware);
app.use(notFoundMiddleware);

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});