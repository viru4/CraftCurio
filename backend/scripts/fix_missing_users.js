import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Artisan from '../src/models/Artisan.js';
import Collector from '../src/models/Collector.js';
import User from '../src/models/User.js';

dotenv.config();

const fixMissingUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Fix Artisans
        const artisans = await Artisan.find({ userId: { $exists: false } });
        console.log(`Found ${artisans.length} artisans without userId.`);

        for (const artisan of artisans) {
            const emailId = artisan.id || artisan.name.toLowerCase().replace(/\s+/g, '') + '_' + Math.floor(Math.random() * 1000);
            const email = `${emailId}@craftcurio.com`;

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: artisan.name,
                    email,
                    password: hashedPassword,
                    role: 'artisan',
                    profileImage: artisan.profilePhotoUrl,
                    address: {
                        city: artisan.location ? artisan.location.split(',')[0].trim() : 'Unknown',
                        country: 'India'
                    }
                });
                console.log(`Created user for artisan: ${artisan.name}`);
            }

            artisan.userId = user._id;
            await artisan.save();
            console.log(`Updated artisan: ${artisan.name}`);
        }

        // Fix Collectors
        const collectors = await Collector.find({ userId: { $exists: false } });
        console.log(`Found ${collectors.length} collectors without userId.`);

        for (const collector of collectors) {
            const emailId = collector.id || collector.name.toLowerCase().replace(/\s+/g, '') + '_' + Math.floor(Math.random() * 1000);
            const email = `${emailId}@craftcurio.com`;

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: collector.name,
                    email,
                    password: hashedPassword,
                    role: 'collector',
                    profileImage: collector.profilePhotoUrl,
                    address: {
                        city: collector.location ? collector.location.split(',')[0].trim() : 'Unknown',
                        country: 'India'
                    }
                });
                console.log(`Created user for collector: ${collector.name}`);
            }

            collector.userId = user._id;
            await collector.save();
            console.log(`Updated collector: ${collector.name}`);
        }

        console.log('Migration completed.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fixMissingUsers();
