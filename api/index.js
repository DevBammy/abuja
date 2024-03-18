import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import authRouter from './routes/authRoutes.js';
import regRouter from './routes/regRoutes.js';

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('connected to Mongodb');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('server started on port 3000');
});

app.use('/api/auth', authRouter);
app.use('/api/reg', regRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
