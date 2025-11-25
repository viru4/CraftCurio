/**
 * Migration Script: Add or normalize custom IDs for collectors
 *
 * Usage:
 *   cd backend
 *   node scripts/migrate-collector-ids.js
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import Collector from '../src/models/Collector.js';
import { normalizeCollectorId } from '../src/utils/collectorIdentifier.js';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/craftcurio';
const formatCollectorId = (num) => `collector-${String(num).padStart(3, '0')}`;

async function migrateCollectorIds() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const collectors = await Collector.find().sort({ createdAt: 1 });
    if (!collectors.length) {
      console.log('ℹ️  No collectors found. Nothing to do.');
      return;
    }

    const usedIds = new Set();
    let nextCounter = 1;
    let updatedCount = 0;
    let normalizedCount = 0;

    const reserveId = (candidate) => {
      usedIds.add(candidate);
      return candidate;
    };

    const getNextAvailableId = () => {
      while (usedIds.has(formatCollectorId(nextCounter))) {
        nextCounter += 1;
      }
      return reserveId(formatCollectorId(nextCounter++));
    };

    for (const collector of collectors) {
      let desiredId = collector.id ? normalizeCollectorId(collector.id) : null;

      if (desiredId && usedIds.has(desiredId)) {
        // Duplicate detected, force a new id
        desiredId = null;
      }

      if (!desiredId) {
        desiredId = getNextAvailableId();
      } else {
        reserveId(desiredId);
      }

      if (collector.id !== desiredId) {
        collector.id = desiredId;
        // eslint-disable-next-line no-await-in-loop
        await collector.save();
        updatedCount += 1;
      } else {
        normalizedCount += 1;
      }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   ➤ Collectors processed: ${collectors.length}`);
    console.log(`   ➤ IDs added/updated   : ${updatedCount}`);
    console.log(`   ➤ Already normalized  : ${normalizedCount}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

migrateCollectorIds();

