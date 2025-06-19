import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import  connectDB  from "./db/connection.js";
import routes from "./routes/index.js";


const PORT = process.env.PORT || 5050;
const app = express();

import cookieParser from 'cookie-parser';

app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();



// routes 
app.use("/api", routes);




//make sure to import the multer middleware
// import { upload } from "./middleware/multer.middlewares.js";
// app.post('/profile', upload.single('avatar'), (req, res) => {
//   res.json({
//     file: req.file,
//     body: req.body
//   });
//   console.log("File uploaded successfully:", req.file);
//   console.log("Request body:", req.body);
// });






// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});