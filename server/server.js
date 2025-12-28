import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

// DB
await connectDB();

// Middleware
app.use(cors());

// ⚠️ IMPORTANT
// Clerk webhook ke liye raw body
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// Normal JSON routes ke liye
app.use(express.json());

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
