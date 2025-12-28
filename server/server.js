import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize Express
const app = express();

// Database Connection
await connectDB();

// Middleware
app.use(cors());

// ✅ Clerk Webhook (RAW BODY – VERY IMPORTANT)
app.post(
  '/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  clerkWebhooks
);

// ✅ Normal JSON middleware (after webhook)
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Job Portal Server is Running');
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
