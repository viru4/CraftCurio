import Artisan from '../../src/models/Artisan.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';
import { artisansData } from '../data/artisans.js';

// Generate a seeder function that upserts artisans using Mongoose bulkWrite
export const seedArtisans = async (verbose = true) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const artisansWithUsers = await Promise.all(artisansData.map(async (artisan) => {
      // Create or find user for this artisan
      const email = `${artisan.id}@craftcurio.com`;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name: artisan.name,
          email,
          password: hashedPassword,
          role: 'artisan',
          profileImage: artisan.profilePhotoUrl,
          address: {
            city: artisan.location.split(',')[0].trim(),
            country: 'India'
          }
        });
        if (verbose) console.log(`   Created user for artisan: ${artisan.name}`);
      }

      return {
        ...artisan,
        userId: user._id
      };
    }));

    const bulkOps = artisansWithUsers.map(artisan => ({
      updateOne: {
        filter: { id: artisan.id },  // Find artisan by unique ID
        update: { $set: artisan },   // Update all fields
        upsert: true                 // Insert if not found
      }
    }));

    const result = await Artisan.bulkWrite(bulkOps);

    if (verbose) {
      console.log(`👨‍🎨 Artisans - Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
    }

    return {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total: artisansData.length
    };
  } catch (error) {
    console.error('❌ Artisans seeding failed:', error.message);
    throw error;
  }
};