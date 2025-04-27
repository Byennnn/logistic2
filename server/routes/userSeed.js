import user from './models/User.js'
import bcrypt from bcrypt
import connectToDatabase from '../db/db'


const userRegister = async () => {
    try {
        connectToDatabase()
        const hashPassword = await bcrypt.hash("logistic", 10)
        const newUser = new User({
            name: "logistic2",
            email: "Logistic2@gmail.com",
            password: hashPassword,
        })
        await newUser.save()

    }catch(error) {
        console.log(error)
    }
}

userRegister();