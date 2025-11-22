import dotenv from 'dotenv';
import { sendOTPEmail } from './src/services/emailService.js';

// Load environment variables
dotenv.config();

console.log('\n🧪 Testing Email Configuration\n');
console.log('Environment Variables:');
console.log(`EMAIL_SERVICE: ${process.env.EMAIL_SERVICE}`);
console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '***SET*** (' + process.env.EMAIL_PASSWORD.length + ' chars)' : 'NOT SET'}`);
console.log('\n');

// Test sending OTP
const testEmail = process.env.EMAIL_USER || 'test@example.com';
const testOTP = '123456';

console.log(`📧 Attempting to send test OTP to: ${testEmail}\n`);

sendOTPEmail(testEmail, testOTP, 'signin')
  .then(result => {
    console.log('\n✅ Email test completed!');
    console.log('Result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Email test failed!');
    console.error('Error:', error.message);
    process.exit(1);
  });
