import jwt from 'jsonwebtoken'
import UserModel from  '../models/User.js'
import bcrypt from 'bcryptjs'
//import connectToDatabase from '../db/db.js'
import generateServiceToken from '../models/gatewayTokenGenerator.js'
import axios from 'axios'
import 'dotenv/config'
//connectToDatabase()
const login = async (req, res) => { 
    try {
        const {email, password} = req.body;
        
        const serviceToken = generateServiceToken();

        const response = await axios.get(
          `${process.env.API_GATEWAY_URL}/admin/get-accounts`,
          {
            headers: { Authorization: `Bearer ${serviceToken}` },
          }
        );
      
        const accountData = response.data;
      
        console.log(accountData);
      
        // const user = await userModel.findOne({ email });
        const user = accountData.find((a) => a.email === email);
      
        console.log(user);
       
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            res.status(404).json({success: false, error: "Invalid Password"})
        }

        if(user?.LogisticLevel === 1){
            return res.status(200).json({success:true, token:createToken(user._id),user})
        }
        if(user?.LogisticLevel === 2){
            return res.status(200).json({success:true, token:createToken(user._id),user})
        }


        // const token = jwt.sign({_id: user._id, email: user.email, password: user.password},
        //     process.env.SERVICE_JWT_SECRET, {expiresIn: "10m"}

        // );

        // res.status(200).json({
        //     success: true, token, user: {_id: user._id, email: user.email, password: user.password},}
        // );

    } catch (error) {
        console.log(error.message);
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };



export {login}