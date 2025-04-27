import { login } from '../controllers/authController.js'

import express from 'express'




const router = express.Router();
router.post('/login', login)



// router.use(express.json())



export default router;