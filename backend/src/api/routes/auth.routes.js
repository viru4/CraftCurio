import express from 'express'
import { signIn, signUp, logout, getCurrentUser, getProfile, updateProfile, changePassword } from '../controllers/auth.controllers.js'
import { authenticate } from '../../middleware/authMiddleware.js'

const authRouter = express.Router()

authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.post("/logout", logout)
authRouter.get("/me", authenticate, getCurrentUser)
authRouter.get("/profile", authenticate, getProfile)
authRouter.put("/profile", authenticate, updateProfile)
authRouter.put("/change-password", authenticate, changePassword)

export default authRouter