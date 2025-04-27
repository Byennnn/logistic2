import User from './models/User.js'
import bcryt from 'bcrypt'
co


const userRegister = async () => {
    try {
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,

        })
        await newUser.save()
    } catch(error){
        console.log(error)

    }
}

userRegister();