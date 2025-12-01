import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ArtisanProduct from '../src/models/ArtisanProduct.js';
import Artisan from '../src/models/Artisan.js';

dotenv.config();

const fixArtisanProductIds = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        // 1. Fetch all Artisans
        const artisans = await Artisan.find({});
        console.log(`Found ${artisans.length} artisans.`);

        // Create a map of Name -> Artisan Document
        const artisanMap = {};
        artisans.forEach(artisan => {
            if (artisan.name) {
                artisanMap[artisan.name] = artisan;
            }
        });

        // 2. Fetch all Artisan Products
        const products = await ArtisanProduct.find({});
        console.log(`Found ${products.length} artisan products.`);

        let updatedCount = 0;

        for (const product of products) {
            if (product.artisanInfo && product.artisanInfo.name) {
                const artisanName = product.artisanInfo.name;
                const matchingArtisan = artisanMap[artisanName];

                if (matchingArtisan) {
                    // Check if ID needs update
                    if (product.artisanInfo.id !== matchingArtisan.id) {
                        console.log(`Updating product "${product.title}"`);
                        console.log(`  Current Artisan ID: ${product.artisanInfo.id}`);
                        console.log(`  New Artisan ID: ${matchingArtisan.id} (from artisan "${artisanName}")`);

                        product.artisanInfo.id = matchingArtisan.id;
                        // Also update other info to ensure consistency
                        product.artisanInfo.profilePhotoUrl = matchingArtisan.profilePhotoUrl;
                        product.artisanInfo.briefBio = matchingArtisan.briefBio;
                        product.artisanInfo.verified = matchingArtisan.verified;

                        await product.save();
                        updatedCount++;
                    }
                } else {
                    console.log(`WARNING: No matching artisan found for product "${product.title}" with artisan name "${artisanName}"`);
                }
            }
        }

        console.log(`\nMigration complete. Updated ${updatedCount} products.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fixArtisanProductIds();
