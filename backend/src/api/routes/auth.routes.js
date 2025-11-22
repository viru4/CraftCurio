import express from 'express'
import { signIn, signUp, logout, getCurrentUser, getProfile, updateProfile, changePassword } from '../controllers/auth.controllers.js'
import { sendOTPForSignIn, verifyOTPForSignIn, sendOTPForSignUp, verifyOTPForSignUp } from '../controllers/otp.controllers.js'
import { testEmail } from '../controllers/emailTest.controller.js'
import { authenticate } from '../../middleware/authMiddleware.js'

const authRouter = express.Router()

// OTP-based authentication routes
authRouter.post("/send-otp-signin", sendOTPForSignIn)
authRouter.post("/verify-otp-signin", verifyOTPForSignIn)
authRouter.post("/send-otp-signup", sendOTPForSignUp)
authRouter.post("/verify-otp-signup", verifyOTPForSignUp)

// Test email configuration
authRouter.post("/test-email", testEmail)

// Legacy password-based routes (kept for backward compatibility)
authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.post("/logout", logout)
authRouter.get("/me", authenticate, getCurrentUser)
authRouter.get("/profile", authenticate, getProfile)
authRouter.put("/profile", authenticate, updateProfile)
authRouter.put("/change-password", authenticate, changePassword)

export default authRouter