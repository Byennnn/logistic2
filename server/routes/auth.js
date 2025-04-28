import express from 'express';
import { 
  initiateLogin, 
  verifyLoginOTP, 
  initiateSignup, 
  verifySignupOTP 
} from '../controllers/authController.js';

const router = express.Router();

// Login flow
router.post('/initiate-login', initiateLogin);
router.post('/verify-login-otp', verifyLoginOTP);

// Signup flow
router.post('/initiate-signup', initiateSignup);
router.post('/verify-signup-otp', verifySignupOTP);

export default router;