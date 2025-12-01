import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from '../src/models/User.js';
import Artisan from '../src/models/Artisan.js';
import Collector from '../src/models/Collector.js';

dotenv.config();

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('id_check_output.txt', msg + '\n');
};

const checkIds = async () => {
    try {
        fs.writeFileSync('id_check_output.txt', ''); // Clear file
        log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        log('Connected.');

        log('\n--- Users ---');
        const user = await User.findOne();
        if (user) {
            log('Sample User:');
            log(`_id: ${user._id} (Type: ${typeof user._id}, Constructor: ${user._id.constructor.name})`);
        } else {
            log('No users found.');
        }

        log('\n--- Artisans ---');
        const artisan = await Artisan.findOne();
        if (artisan) {
            log('Sample Artisan:');
            log(`_id: ${artisan._id} (Type: ${typeof artisan._id}, Constructor: ${artisan._id.constructor.name})`);
            log(`id: ${artisan.id} (Type: ${typeof artisan.id})`);
            log(`userId: ${artisan.userId} (Type: ${typeof artisan.userId}, Constructor: ${artisan.userId ? artisan.userId.constructor.name : 'N/A'})`);
        } else {
            log('No artisans found.');
        }

        log('\n--- Collectors ---');
        const collector = await Collector.findOne();
        if (collector) {
            log('Sample Collector:');
            log(`_id: ${collector._id} (Type: ${typeof collector._id}, Constructor: ${collector._id.constructor.name})`);
            log(`id: ${collector.id} (Type: ${typeof collector.id})`);
            log(`userId: ${collector.userId} (Type: ${typeof collector.userId}, Constructor: ${collector.userId ? collector.userId.constructor.name : 'N/A'})`);
        } else {
            log('No collectors found.');
        }

    } catch (error) {
        console.error('Error:', error);
        log(`Error: ${error}`);
    } finally {
        await mongoose.disconnect();
    }
};

checkIds();
