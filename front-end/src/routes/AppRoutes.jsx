import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/SignIn'

const hasClerk = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthDisabled() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Authentication not configured</h1>
        <p className="text-[var(--text-secondary)] mt-2">Sign-in is unavailable because the app is missing VITE_CLERK_PUBLISHABLE_KEY.</p>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={hasClerk ? <SignInPage /> : <AuthDisabled />} />
    </Routes>
  )
}
