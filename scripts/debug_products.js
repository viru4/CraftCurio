import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Collectible from '../backend/src/models/Collectible.js';
import ArtisanProduct from '../backend/src/models/ArtisanProduct.js';
import Collector from '../backend/src/models/Collector.js';
import Artisan from '../backend/src/models/Artisan.js';
import User from '../backend/src/models/User.js';

dotenv.config({ path: 'backend/.env' });

const debugProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check Collectible
        const collectible = await Collectible.findOne().populate('owner');
        console.log('\n--- Collectible ---');
        if (collectible) {
            console.log('ID:', collectible._id);
            console.log('Title:', collectible.title);
            console.log('Owner:', collectible.owner);
            if (collectible.owner) {
                console.log('Owner UserID:', collectible.owner.userId);
            } else {
                console.log('Owner is null');
            }
        } else {
            console.log('No collectibles found');
        }

        // Check Artisan Product
        const artisanProduct = await ArtisanProduct.findOne().populate('artisanInfo.id');
        console.log('\n--- Artisan Product ---');
        if (artisanProduct) {
            console.log('ID:', artisanProduct._id);
            console.log('Title:', artisanProduct.title);
            console.log('ArtisanInfo:', artisanProduct.artisanInfo);
            if (artisanProduct.artisanInfo && artisanProduct.artisanInfo.id) {
                console.log('Artisan UserID:', artisanProduct.artisanInfo.id.userId);
            } else {
                console.log('ArtisanInfo.id is null');
            }
        } else {
            console.log('No artisan products found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugProducts();
