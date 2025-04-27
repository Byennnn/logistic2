

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import UserModel from './models/User.js'
import jwt from 'jsonwebtoken'
import authRouter from './routes/auth.js'
//import connectToDatabase from './db/db.js'
import generateServiceToken from './models/gatewayTokenGenerator.js'
import "dotenv/config";
import warehouseRoutes from './routes/WarehouseRoutes.js'
import Delivery from "./models/Delivery.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import inventoryRecords from "./routes/inventoryRecords.js"
import finishedProductTransferRoutes from "./routes/finishedProductTransferRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import auditReportRoutes from "./routes/auditReportRoutes.js";



//connectToDatabase()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/inventoryrecords", inventoryRecords);
app.use("/api/finishedproducttransfers", finishedProductTransferRoutes);
app.use("/api/invoices", invoiceRoutes );
app.use('/', auditReportRoutes)
app.use("/api", finishedProductTransferRoutes);




const ConnectDB = async () => {
    await mongoose
      .connect(process.env.MONGODB)
      .then(() => console.log("Db Connected"));
  };

  ConnectDB()















app.post("/register", (req, res) => {
    const {name, email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user) {
            res.json("Already have an Account")
        } else {
            UserModel.create({name: name, email: email, password: password})
            .then(result => res.json("Account Created",)) 
            .catch(err => res.json("Error Please Try Again"))
        }
    }).catch(err => res.json(err))
})

app.post("/login", async () => {
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
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, msg: "Invalid Email or Password" });
        }
      

        // const user = await UserModel.findOne({email: email})
        // if(!user) {
        //     res.status(404).json({success: false, error: "User Not Found"})
        // }
       
        // const isMatch = await bcrypt.compare(password, password)
        // if(!isMatch){
        //     res.status(404).json({success: false, error: "Wrong Password"})
        // }

        const token = jwt.sign({_id: user._id, email: email, password: password},
            process.env.GATEWAY_JWT_SECRET, {expiresIn: "10m"}

        );

        res.status(200).json({
            success: true, token, user: {_id: user._id, email: user.email, password: user.password},}
        );

    } catch (error) {
        console.log(error.message);
    }
} )

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
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, msg: "Invalid Email or Password" });
        }
      

        // const user = await UserModel.findOne({email: email})
        // if(!user) {
        //     res.status(404).json({success: false, error: "User Not Found"})
        // }
       
        // const isMatch = await bcrypt.compare(password, password)
        // if(!isMatch){
        //     res.status(404).json({success: false, error: "Wrong Password"})
        // }

        const token = jwt.sign({_id: user._id, email: email, password: password},
            process.env.GATEWAY_JWT_SECRET, {expiresIn: "10m"}

        );

        res.status(200).json({
            success: true, token, user: {_id: user._id, email: user.email, password: user.password},}
        );

    } catch (error) {
        console.log(error.message);
    }
}

export default {login}



app.use(express.json())








app.listen(7689, () => {
    console.log(`Server is Running  ${process.env.PORT}`)
})
