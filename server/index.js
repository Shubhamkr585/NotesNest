import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  connectDB  from "./db/connection.js";
import cookieParser from 'cookie-parser';
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import orderRoutes from './routes/order.routes.js';
import viewRoutes from './routes/view.routes.js';
import rateLimit from 'express-rate-limit';
import morganMiddleware from "./middlewares/morganMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morganMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/views', viewRoutes);



// Error-handling middleware
app.use(errorMiddleware);


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// app.listen(5000, '0.0.0.0', () => {
//   console.log('Server running on port 5000');
// });








