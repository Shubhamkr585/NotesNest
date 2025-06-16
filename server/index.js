import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import  connectDB  from "./db/connection.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
// Connect to MongoDB
connectDB();

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});