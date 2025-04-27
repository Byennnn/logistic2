import mongoose from "mongoose";

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGODB)

    } catch(error){
        console.log(error)

    }
}

export default connectToDatabase