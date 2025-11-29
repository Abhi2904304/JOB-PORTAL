import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import mongoose from 'mongoose';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';

//  Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/jobportal")
const db = mongoose.connection;

//  Initialize Express 
const app = express();

//  Middleware
app.use(cors());
app.use(express.json());

//  Routes
app.get('/', (req, res) => 
    res.send('Api Working'));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerkWebhooks);

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
});