import express from 'express';
import cors from 'cors';
import mealsRouter from './routes/meals';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.use(mealsRouter);

app.use(errorHandler);

export default app;
