import mongoose from 'mongoose';
import Collector from '../models/Collector.js';

/**
 * Migration Script: Remove custom 'id' field from Collector model
 * 
 * This script:
 * 1. Removes the custom 'id' field from all collectors
 * 2. Ensures all collectors have a valid userId
 * 3. Reports on any collectors that need manual fixing
 */

const migrateCollectors = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/craftcurio';
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        // Step 1: Remove 'id' field from all collectors
        const removeResult = await Collector.updateMany(
            { id: { $exists: true } },
            { $unset: { id: "" } }
        );
        console.log(`✓ Removed 'id' field from ${removeResult.modifiedCount} collectors`);

        // Step 2: Find collectors without userId
        const collectorsWithoutUserId = await Collector.find({ userId: { $exists: false } });
        if (collectorsWithoutUserId.length > 0) {
            console.log(`\n⚠️  WARNING: Found ${collectorsWithoutUserId.length} collectors without userId:`);
            collectorsWithoutUserId.forEach(c => {
                console.log(`   - Collector _id: ${c._id}, name: ${c.name}`);
            });
            console.log('   These collectors need manual fixing - assign them a userId\n');
        } else {
            console.log('✓ All collectors have userId');
        }

        // Step 3: Find collectors with null userId
        const collectorsWithNullUserId = await Collector.find({ userId: null });
        if (collectorsWithNullUserId.length > 0) {
            console.log(`\n⚠️  WARNING: Found ${collectorsWithNullUserId.length} collectors with null userId:`);
            collectorsWithNullUserId.forEach(c => {
                console.log(`   - Collector _id: ${c._id}, name: ${c.name}`);
            });
            console.log('   These collectors need manual fixing - assign them a userId\n');
        }

        // Step 4: Summary
        const totalCollectors = await Collector.countDocuments();
        const collectorsWithUserId = await Collector.countDocuments({
            userId: { $exists: true, $ne: null }
        });

        console.log('\n📊 Migration Summary:');
        console.log(`   Total collectors: ${totalCollectors}`);
        console.log(`   Collectors with userId: ${collectorsWithUserId}`);
        console.log(`   Collectors needing attention: ${totalCollectors - collectorsWithUserId}`);

        await mongoose.connection.close();
        console.log('\n✓ Migration completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run migration
migrateCollectors();
