import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from './routes/authRoutes.js';
import regRouter from './routes/regRoutes.js';
import cookieParser from 'cookie-parser';
import updateRoute from './routes/updateRoute.js';
import path from 'path';

const app = express();

app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('connected to Mongodb');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

app.listen(3000, () => {
  console.log('server started on port 3000');
});

app.use('/api/auth', authRouter);
app.use('/api/reg', regRouter);
app.use('/api/user', updateRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
