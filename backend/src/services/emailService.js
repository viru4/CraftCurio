import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, use Gmail or other SMTP service
  // For production, configure with your email service credentials
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  let emailUser = process.env.EMAIL_USER;
  let emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    return null; // Will be handled in sendOTPEmail
  }

  // Clean up credentials (remove spaces and trim)
  emailUser = emailUser.trim();
  emailPassword = emailPassword.trim().replace(/\s+/g, ''); // Remove all spaces

  // For Gmail, use OAuth2 or App Password
  if (emailService === 'gmail' || emailUser.includes('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      // Additional options for better compatibility
      tls: {
        rejectUnauthorized: false
      },
      // Connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  // For other services, use SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword
    },
    // Connection timeout
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // TLS options
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send OTP email to user
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} purpose - 'signin' or 'signup'
 * @returns {Promise<Object>} Email send result
 */
export const sendOTPEmail = async (email, otp, purpose = 'signin') => {
  // Always log OTP to console for development/debugging
  console.log('\n📧 ========== OTP GENERATED ==========');
  console.log(`Email: ${email}`);
  console.log(`OTP: ${otp}`);
  console.log(`Purpose: ${purpose}`);
  console.log(`Expires in: 10 minutes`);
  console.log('=====================================\n');

  // Debug: Check environment variables (masked for security)
  let emailUser = process.env.EMAIL_USER;
  let emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  // Clean up credentials (remove spaces and trim)
  if (emailUser) {
    emailUser = emailUser.trim();
  }
  if (emailPassword) {
    // Remove all spaces - Gmail App Passwords should be 16 chars without spaces
    emailPassword = emailPassword.trim().replace(/\s+/g, '');
  }
  
  console.log('🔍 Email Configuration Check:');
  console.log(`   EMAIL_SERVICE: ${emailService}`);
  console.log(`   EMAIL_USER: ${emailUser ? emailUser.substring(0, 3) + '***' + emailUser.substring(emailUser.indexOf('@')) : 'NOT SET'}`);
  console.log(`   EMAIL_PASSWORD: ${emailPassword ? `***SET*** (${emailPassword.length} chars)` : 'NOT SET'}`);
  if (emailPassword && emailPassword.length !== 16 && emailUser?.includes('@gmail.com')) {
    console.log(`   ⚠️  WARNING: Gmail App Password should be 16 characters. Current length: ${emailPassword.length}`);
    console.log(`   💡 If your password has spaces, they will be automatically removed.`);
  }
  console.log('');

  try {
    // If email service is not configured, just log and return
    if (!emailUser || !emailPassword) {
      console.log('⚠️  Email service not configured. OTP is logged above.');
      console.log('💡 To enable email sending, add EMAIL_USER and EMAIL_PASSWORD to your .env file');
      console.log('💡 Make sure .env file is in the backend/ directory');
      console.log('💡 Restart the server after adding .env variables');
      return { success: true, message: 'OTP logged to console (email service not configured)' };
    }

    // Use cleaned credentials for transporter
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('⚠️  Email transporter could not be created. Check your email configuration.');
      return { success: true, message: 'OTP logged to console (email service not configured)' };
    }

    const purposeText = purpose === 'signup' ? 'Sign Up' : 'Sign In';
    const subject = `CraftCurio ${purposeText} Verification Code`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ec6d13 0%, #f97316 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CraftCurio</h1>
          </div>
          <div style="background: #f8f7f6; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e7d9cf;">
            <h2 style="color: #1b130d; margin-top: 0;">Your Verification Code</h2>
            <p style="color: #9a6c4c; font-size: 16px;">Hello,</p>
            <p style="color: #1b130d;">You requested a verification code to ${purposeText.toLowerCase()} to CraftCurio. Use the code below to complete your ${purposeText.toLowerCase()} process:</p>
            <div style="background: white; border: 2px dashed #ec6d13; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #ec6d13; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            <p style="color: #9a6c4c; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #9a6c4c; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e7d9cf; margin: 30px 0;">
            <p style="color: #9a6c4c; font-size: 12px; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} CraftCurio. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    const textContent = `
      CraftCurio ${purposeText} Verification Code
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
      
      © ${new Date().getFullYear()} CraftCurio. All rights reserved.
    `;

    const mailOptions = {
      from: `"CraftCurio" <${emailUser}>`,
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent
    };

    // Verify transporter connection before sending
    try {
      console.log('🔄 Verifying email server connection...');
      await transporter.verify();
      console.log('✅ Email server connection verified');
    } catch (verifyError) {
      console.error('❌ Email server connection failed!');
      console.error('   Error:', verifyError.message);
      console.error('   Code:', verifyError.code);
      
      // Provide specific error messages
      if (verifyError.code === 'EAUTH') {
        console.error('   💡 Authentication failed. Check your email and password.');
        console.error('   💡 For Gmail, make sure you\'re using an App Password, not your regular password.');
        console.error('   💡 Enable 2-Step Verification and generate an App Password.');
      } else if (verifyError.code === 'ECONNECTION') {
        console.error('   💡 Connection failed. Check your internet connection and firewall settings.');
      } else if (verifyError.code === 'ETIMEDOUT') {
        console.error('   💡 Connection timeout. Check your SMTP settings and port.');
      }
      
      console.log('💡 OTP is still logged above. You can use it to verify.');
      return { success: true, message: 'OTP logged to console (email connection failed)', error: verifyError.message };
    }

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);
    console.log(`   To: ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error!');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Command:', error.command);
    console.error('   Response:', error.response);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      console.error('   💡 Authentication failed. Check your email and password.');
      console.error('   💡 For Gmail, use an App Password (not your regular password).');
    } else if (error.code === 'EENVELOPE') {
      console.error('   💡 Invalid recipient email address.');
    } else if (error.response) {
      console.error('   💡 SMTP Server Response:', error.response);
    }
    
    console.log('💡 OTP is still logged above. You can use it to verify.');
    
    // Don't throw error - return success so OTP can still be used
    // The OTP is already logged to console
    return { 
      success: true, 
      message: 'OTP logged to console (email sending failed)',
      error: error.message 
    };
  }
};

export default { sendOTPEmail };

