import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== 'test') {
  config();
}

// Conntect DB
import './models/db';

import userRoute from './routes/user';
import taskRoute from './routes/task';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoute);
app.use('/tasks', taskRoute);

export { app };
