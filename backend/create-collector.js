import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collector from './src/models/Collector.js';
import { generateCollectorId } from './src/utils/collectorIdentifier.js';

dotenv.config();

const createCollector = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/craftcurio');
        console.log('Connected to MongoDB');

        // Create collector
        const collectorId = await generateCollectorId();

        const collector = new Collector({
            id: collectorId,
            name: 'Test Collector',
            location: 'India',
            interests: ['Vintage Coins', 'Antiques']
        });

        await collector.save();
        console.log('Collector created successfully:', collector);

        await mongoose.connection.close();
        console.log('Connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createCollector();
