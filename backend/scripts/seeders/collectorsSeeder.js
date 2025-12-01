import Collector from '../../src/models/Collector.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';
import { collectorsData } from '../data/collectors.js';

// Generate a seeder function that upserts collectors using Mongoose bulkWrite
export const seedCollectors = async (verbose = true) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const collectorsWithUsers = await Promise.all(collectorsData.map(async (collector) => {
      // Create or find user for this collector
      // Use collector.id or sanitize name for email
      const emailId = collector.id || collector.name.toLowerCase().replace(/\s+/g, '');
      const email = `${emailId}@craftcurio.com`;

      let user = await User.findOne({ email });

      if (!user) {
        // Check if userId is already provided in data (e.g. for the first collector)
        if (collector.userId) {
          // Try to find by ID if provided
          user = await User.findById(collector.userId);
        }

        if (!user) {
          user = await User.create({
            name: collector.name,
            email,
            password: hashedPassword,
            role: 'collector',
            profileImage: collector.profilePhotoUrl,
            address: {
              city: collector.location.split(',')[0].trim(),
              country: 'India'
            }
          });
          if (verbose) console.log(`   Created user for collector: ${collector.name}`);
        }
      }

      return {
        ...collector,
        userId: user._id
      };
    }));

    const bulkOps = collectorsWithUsers.map(collector => {
      const filter = collector.id ? { id: collector.id } : { name: collector.name };
      return {
        updateOne: {
          filter,
          update: { $set: collector },
          upsert: true
        }
      };
    });

    const result = await Collector.bulkWrite(bulkOps);

    if (verbose) {
      console.log(`🎯 Collectors - Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
    }

    return {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: collectorsData.length
    };
  } catch (error) {
    console.error('❌ Collectors seeding failed:', error.message);
    throw error;
  }
};