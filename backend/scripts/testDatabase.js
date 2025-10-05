import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Simple schema to test
const ArtisanProductSchema = new mongoose.Schema({}, { collection: 'artisanproducts', strict: false });
const ArtisanProduct = mongoose.model('TestArtisanProduct', ArtisanProductSchema);

async function testDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get artisan-002 specifically
    const artisan002 = await ArtisanProduct.findOne({ id: 'artisan-002' });
    
    if (artisan002) {
      console.log('🎯 Found artisan-002:');
      console.log('Title:', artisan002.title);
      console.log('Images:', artisan002.images);
      console.log('First Image:', artisan002.images?.[0]);
      console.log('Contains Brave:', artisan002.images?.[0]?.includes('brave.com') ? 'YES' : 'NO');
    } else {
      console.log('❌ artisan-002 not found');
    }
    
    // Check all collections in database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Collections in database:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

testDatabase();