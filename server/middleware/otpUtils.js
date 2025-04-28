import nodemailer from 'nodemailer';
import { totp } from 'otplib';
import 'dotenv/config';


totp.options = { 
  step: 300,  
  digits: 6  
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true, // Enable debug output
    logger: true  // Log information about the mail
  });
  
  // Test the connection before using it
  transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to send messages');
    }
  });

export const generateOTP = (email) => {
  const secret = `${email}-${process.env.OTP_SECRET_KEY}-${Date.now()}`;
  const otp = totp.generate(secret);
  
  
  return { otp, secret };
};


export const sendOTPEmail = async (email, otp, isSignup = false) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: isSignup ? 'Verify Your Email for Signup' : 'Login Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${isSignup ? 'Complete Your Registration' : 'Login Verification'}</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4285f4; font-size: 32px; letter-spacing: 5px; text-align: center; margin: 30px 0;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};


export const verifyOTP = (otp, secret) => {
  try {
    return totp.verify({ token: otp, secret });
  } catch (error) {
    console.error('OTP verification error:', error);
    return false;
  }
};