import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from '../routes/auth.js';
import notesRoutes from '../routes/notes.js';
import tenantsRoutes from '../routes/tenants.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://your-frontend.vercel.app", // Replace with deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.use(cors());
app.use(express.json());

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// DB connect & start (if running as standalone server)
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 8000;
      app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;