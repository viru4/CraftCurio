import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/SignIn'
<<<<<<< HEAD
import CollectiblesMain from '@/pages/CollectiblesMain'
=======
import SignUpPage from '@/pages/SignUp'
import SellerRegistration from '@/pages/SellerRegistration'
import Collectibles from '@/pages/Collectibles'

import { isValidPublishableKey } from '@/lib/utils'

const hasClerk = isValidPublishableKey(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

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
>>>>>>> 28e0514cf39066b27d5c1cdf6a02772f92d2c0b1

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
<<<<<<< HEAD
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/collectibles-main" element={<CollectiblesMain/>}/>
=======
      <Route path="/sign-in" element={hasClerk ? <SignInPage /> : <AuthDisabled />} />
      <Route path="/sign-up" element={hasClerk ? <SignUpPage /> : <AuthDisabled />} />
      <Route path="/become-seller" element={<SellerRegistration />} />
      <Route path="/collectibles" element={<Collectibles />} />
>>>>>>> 28e0514cf39066b27d5c1cdf6a02772f92d2c0b1
    </Routes>
  )
}
