import mongoose  from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri= process.env.ATLAS_URI || ""
const connectDB = async (retries = 5, delay = 3000) => {
    try{
     const conn= await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        conn.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
        // Optionally, retry connection
        // if (retries > 0) {
        //     console.log(`Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} retries left)`);
        //     setTimeout(() => connectDB(retries - 1, delay), delay);
        // } else {
        //     process.exit(1); // Exit the process with failure after all retries
        // }
       process.exit(1); 
    }
}

export default connectDB;