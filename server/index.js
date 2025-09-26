import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js';
import errorMiddleware from './middlewares/error.middleware.js';
import morganMiddleware from './middlewares/morgan.middleware.js';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import orderRoutes from './routes/order.routes.js';
import viewRoutes from './routes/view.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(morganMiddleware);

// Rate Limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

// API Routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/views', viewRoutes);

//test->/api/maje
app.get('/api/maje', (req, res) => {
    console.log('maje');
    res.status(200).json({ message: 'Hello from the server!' });
});

// Error handling middleware
app.use(errorMiddleware);

// Connect to DB and start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!", err);
        process.exit(1);
    });
