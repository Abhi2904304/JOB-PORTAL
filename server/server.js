import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import {clerkMiddleware} from '@clerk/express';

const app = express();

// DB
await connectDB();
await connectCloudinary();

//  Middleware 
app.use(cors());
app.use(express.json()); 
app.use(clerkMiddleware());

// Clerk webhook 
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// Routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Job Portal Server is Running');
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
