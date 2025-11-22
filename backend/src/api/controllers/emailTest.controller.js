import { sendOTPEmail } from '../../services/emailService.js';

/**
 * Test email configuration endpoint
 * POST /api/auth/test-email
 */
export const testEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    // Generate a test OTP
    const testOTP = '123456';
    
    console.log('\n🧪 ========== EMAIL TEST ==========');
    console.log(`Testing email configuration...`);
    console.log(`Recipient: ${email}`);
    console.log('====================================\n');

    // Try to send test email
    const result = await sendOTPEmail(email, testOTP, 'signin');

    if (result.success && !result.error) {
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.',
        details: {
          messageId: result.messageId,
          email: email
        }
      });
    } else {
      return res.status(200).json({
        success: false,
        message: 'Email sending failed. Check backend console for details.',
        error: result.error,
        note: 'OTP is logged to console. Check backend terminal for OTP code.'
      });
    }
  } catch (error) {
    console.error('Email test error:', error);
    return res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
};
