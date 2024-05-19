import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';

import connectDB from './database/connectDB.js';
import authRouter from './routes/authRoutes.js';
import passRouter from './routes/passRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import busRouter from './routes/busRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api/user', passRouter);
app.use('/api/admin', adminRouter);
app.use('/api', busRouter);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});
