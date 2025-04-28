import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  secret: { 
    type: String, 
    required: true 
  },
  purpose: { 
    type: String, 
    enum: ['signup', 'login'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 300 
  }
});

const OTPModel = mongoose.model("OTP", OTPSchema);

export default OTPModel;