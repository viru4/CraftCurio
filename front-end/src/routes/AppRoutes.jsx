import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/SignIn'
import CollectiblesMain from '@/pages/CollectiblesMain'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/collectibles-main" element={<CollectiblesMain/>}/>
    </Routes>
  )
}
