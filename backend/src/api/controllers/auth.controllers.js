import User from "../../models/User.js"
import bcrypt from 'bcryptjs'
import genToken from "../../utils/token.js"

export const signUp = async (req, res) => {
    try {
        const {fullName, email, password} = req.body
        let user = await User.findOne(email) // check if user already exists or not
        if(user){
            return res.status(500).json({message:"User Already exists"})
        }
        if(password.length < 8){
            return res.status(500).json({message: "Password must be atleast 8 characters long"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            name: fullName,
            email,
            password:hashedPassword
        })

        // Token generation
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json(`signUp error ${error}`)
    }
}

export const signIn = async (req, res) => {
    try {
        const {email, password} = req.body
        let user = await User.findOne(email) // check if user already exists or not
        if(!user){
            return res.status(500).json({message:"User does not exists"})
        }
        const isCorrect = await bcrypt.compare(password, user.password)
        if(!isCorrect){
            return res.status(500).json({message: "Wrong Password"})
        }

        // Token generation
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000,
            httpOnly: true
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json(`signIn error ${error}`)
    }
}