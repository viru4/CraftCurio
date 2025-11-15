import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// User Schema (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'artisan', 'collector'], default: 'buyer' },
  profileImage: { type: String },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/craftcurio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Test credentials
    const testEmail = 'test@craftcurio.com';
    const testPassword = 'Test1234'; // Plain password you'll use to sign in
    const testName = 'Test User';

    // Check if test user already exists
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists. Updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      // Update the user
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('✅ Test user password updated successfully!');
    } else {
      console.log('Creating new test user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      // Create the user
      await User.create({
        name: testName,
        email: testEmail,
        password: hashedPassword,
        role: 'buyer'
      });
      
      console.log('✅ Test user created successfully!');
    }

    console.log('\n📝 Test Credentials:');
    console.log('   Email: test@craftcurio.com');
    console.log('   Password: Test1234');
    console.log('\nYou can now use these credentials to sign in!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

createTestUser();
