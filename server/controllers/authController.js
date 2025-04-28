import UserModel from '../models/User.js';
import OTPModel from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail, verifyOTP } from '../middleware/otpUtils.js';
import 'dotenv/config';


export const initiateLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
   
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid password" });
    }
    
   
    const { otp, secret } = generateOTP(email);
    
  
    await OTPModel.findOneAndDelete({ email, purpose: 'login' }); 
    await OTPModel.create({
      email,
      secret,
      purpose: 'login'
    });
    
   
    const emailSent = await sendOTPEmail(email, otp, false);
    
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
        requireOTP: true,
        email
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP email"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
   
    const otpRecord = await OTPModel.findOne({ email, purpose: 'login' });
    if (!otpRecord) {
      return res.status(400).json({ success: false, error: "OTP expired or not found" });
    }
    
   
    const isValid = verifyOTP(otp, otpRecord.secret);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid OTP" });
    }
    
    
    const user = await UserModel.findOne({ email });
    
    
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    
    await OTPModel.findByIdAndDelete(otpRecord._id);
    
    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, email: user.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const initiateSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
   
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }
    
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
   
    const { otp, secret } = generateOTP(email);
    
    
    await OTPModel.findOneAndDelete({ email, purpose: 'signup' }); 
    await OTPModel.create({
      email,
      secret,
      purpose: 'signup',
      userData: { name, email, hashedPassword } 
    });
    
    
    const emailSent = await sendOTPEmail(email, otp, true);
    
    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
        requireOTP: true,
        email
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP email"
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;
    

    const otpRecord = await OTPModel.findOne({ email, purpose: 'signup' });
    if (!otpRecord) {
      return res.status(400).json({ success: false, error: "OTP expired or not found" });
    }
    

    const isValid = verifyOTP(otp, otpRecord.secret);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid OTP" });
    }
    
   
    let hashedPassword = password;
    if (!password.startsWith('$2')) { 
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });
    
   
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
   
    await OTPModel.findByIdAndDelete(otpRecord._id);
    
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { _id: newUser._id, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};