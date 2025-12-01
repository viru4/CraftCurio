import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Collectible from '../src/models/Collectible.js';
import ArtisanProduct from '../src/models/ArtisanProduct.js';
import Collector from '../src/models/Collector.js';
import Artisan from '../src/models/Artisan.js';
import User from '../src/models/User.js';

dotenv.config();

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('debug_output.txt', msg + '\n');
};

const debugProducts = async () => {
    try {
        fs.writeFileSync('debug_output.txt', ''); // Clear file
        log('Attempting to connect to MongoDB...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        log('Connected to MongoDB');

        // Check Collectible
        const collectible = await Collectible.findOne().populate('owner');
        log('\n--- Collectible ---');
        if (collectible) {
            log(`ID: ${collectible._id}`);
            log(`Title: ${collectible.title}`);
            log(`Owner: ${JSON.stringify(collectible.owner, null, 2)}`);
            if (collectible.owner) {
                log(`Owner UserID: ${collectible.owner.userId}`);
            } else {
                log('Owner is null');
            }
        } else {
            log('No collectibles found');
        }

        // Check Artisan Product
        const artisanProduct = await ArtisanProduct.findOne();
        log('\n--- Artisan Product ---');
        if (artisanProduct) {
            log(`ID: ${artisanProduct._id}`);
            log(`Title: ${artisanProduct.title}`);
            log(`ArtisanInfo: ${JSON.stringify(artisanProduct.artisanInfo, null, 2)}`);

            if (artisanProduct.artisanInfo && artisanProduct.artisanInfo.id) {
                let artisanDoc = await Artisan.findOne({ id: artisanProduct.artisanInfo.id });

                if (!artisanDoc && mongoose.Types.ObjectId.isValid(artisanProduct.artisanInfo.id)) {
                    artisanDoc = await Artisan.findById(artisanProduct.artisanInfo.id);
                }

                if (artisanDoc) {
                    log(`Artisan UserID (Manual Lookup): ${artisanDoc.userId}`);
                } else {
                    log('Artisan document not found via manual lookup');
                }
            } else {
                log('ArtisanInfo.id is null');
            }
        } else {
            log('No artisan products found');
        }

    } catch (error) {
        log(`Error: ${error}`);
    } finally {
        await mongoose.disconnect();
    }
};

debugProducts();
