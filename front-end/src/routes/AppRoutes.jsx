import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import ProductDetails from '@/pages/ProductDetails'
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'
import SellerRegistration from '@/pages/auth/SellerRegistration'
import Collectibles from '@/pages/Collectibles/Collectibles'
import ArtisansProducts from '@/pages/artisans/ArtisansProducts'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/become-seller" element={<SellerRegistration />} />
      <Route path="/collectibles" element={<Collectibles />} />
      <Route path="/artisans" element={<ArtisansProducts />} />
    </Routes>
  )
}
