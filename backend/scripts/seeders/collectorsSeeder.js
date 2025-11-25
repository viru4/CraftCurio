import Collector from '../../src/models/Collector.js';
import { collectorsData } from '../data/collectors.js';

// Generate a seeder function that upserts collectors using Mongoose bulkWrite
export const seedCollectors = async (verbose = true) => {
  try {
    const bulkOps = collectorsData.map(collector => {
      const filter = collector.userId ? { userId: collector.userId } : { name: collector.name };
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