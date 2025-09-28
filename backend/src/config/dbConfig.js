import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

export default connectDB;