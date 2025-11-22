/**
 * Migration Script: Add Custom IDs to Existing Collectibles
 * 
 * This script adds custom 'id' field to all existing collectibles that don't have one.
 * Run this ONCE after deploying the updated Collectible model.
 * 
 * Usage: node scripts/migrate-collectible-ids.js
 */

import mongoose from 'mongoose';
import Collectible from '../src/models/Collectible.js';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/craftcurio';

async function migrateCollectibleIds() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all collectibles without a custom id
    const collectiblesWithoutId = await Collectible.find({ 
      $or: [
        { id: { $exists: false } },
        { id: null },
        { id: '' }
      ]
    });

    console.log(`📊 Found ${collectiblesWithoutId.length} collectibles without custom IDs`);

    if (collectiblesWithoutId.length === 0) {
      console.log('✅ All collectibles already have custom IDs!');
      process.exit(0);
    }

    // Get the highest existing custom ID number
    const existingIds = await Collectible.find({ 
      id: { $exists: true, $ne: null, $ne: '' } 
    }).select('id');
    
    let maxNumber = 0;
    existingIds.forEach(doc => {
      if (doc.id) {
        const match = doc.id.match(/coll-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) maxNumber = num;
        }
      }
    });

    console.log(`📈 Starting from coll-${maxNumber + 1}`);

    // Update collectibles in batches
    let updated = 0;
    for (let i = 0; i < collectiblesWithoutId.length; i++) {
      const collectible = collectiblesWithoutId[i];
      const newId = `coll-${String(maxNumber + i + 1).padStart(3, '0')}`;
      
      collectible.id = newId;
      await collectible.save();
      updated++;

      if (updated % 10 === 0) {
        console.log(`✅ Updated ${updated}/${collectiblesWithoutId.length} collectibles`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updated} collectibles.`);
    console.log('\n📋 Sample of new IDs:');
    
    const samples = await Collectible.find().select('id title').limit(5);
    samples.forEach(s => console.log(`  - ${s.id}: ${s.title}`));

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run migration
migrateCollectibleIds();
