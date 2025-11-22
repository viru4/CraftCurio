import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('\n🔍 Email Configuration Check\n');
console.log('=====================================');

const emailService = process.env.EMAIL_SERVICE || 'gmail';
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

console.log(`EMAIL_SERVICE: ${emailService}`);
console.log(`EMAIL_USER: ${emailUser ? emailUser.substring(0, 3) + '***' + emailUser.substring(emailUser.indexOf('@')) : '❌ NOT SET'}`);
console.log(`EMAIL_PASSWORD: ${emailPassword ? '✅ SET (' + emailPassword.length + ' chars)' : '❌ NOT SET'}`);

console.log('\n=====================================\n');

if (!emailUser || !emailPassword) {
  console.log('❌ Email service is NOT configured!\n');
  console.log('📝 To fix this:');
  console.log('1. Create/edit .env file in backend/ directory');
  console.log('2. Add these lines:');
  console.log('   EMAIL_SERVICE=gmail');
  console.log('   EMAIL_USER=your-email@gmail.com');
  console.log('   EMAIL_PASSWORD=your-app-password');
  console.log('\n3. For Gmail:');
  console.log('   - Enable 2-Step Verification');
  console.log('   - Generate App Password (16 characters)');
  console.log('   - Use App Password, NOT your regular password');
  console.log('\n4. Restart the server after adding .env variables\n');
  process.exit(1);
} else {
  console.log('✅ Email service is configured!\n');
  console.log('💡 If emails are still not sending:');
  console.log('   - Check if you\'re using Gmail App Password (not regular password)');
  console.log('   - Check spam folder');
  console.log('   - Check backend console for detailed error messages');
  console.log('   - Test with: POST /api/auth/test-email\n');
}

