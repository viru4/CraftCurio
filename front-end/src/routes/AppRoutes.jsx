import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import ProductDetails from '@/pages/ProductDetails'
import Cart from '@/pages/Cart'
import CheckOut from '@/pages/Order/CheckOut'
import OrderConfirmation from '@/pages/Order/OrderConfirmation'
import MyOrders from '@/pages/Order/MyOrders'
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'
import SellerRegistration from '@/pages/auth/SellerRegistration'
import Collectibles from '@/pages/Collectibles/Collectibles'
import ArtisansProducts from '@/pages/artisans/ArtisansProducts'
import ArtisanStories from '@/pages/artisans/ArtisanStories'
import ArtisanStoryDetail from '@/pages/artisans/ArtisanStoryDetail'
import Profile from '@/pages/UserProfile/Profile'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/product/:type/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/become-seller" element={<SellerRegistration />} />
      <Route path="/collectibles" element={<Collectibles />} />
      <Route path="/artisans" element={<ArtisansProducts />} />
      <Route path="/artisan-stories" element={<ArtisanStories />} />
      <Route path="/artisan-stories/:id" element={<ArtisanStoryDetail />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}
