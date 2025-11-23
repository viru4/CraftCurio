import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import ProductDetails from '@/pages/ProductDetails'
import Cart from '@/pages/Cart'
import Wishlist from '@/pages/Wishlist'
import CheckOut from '@/pages/Order/CheckOut'
import OrderConfirmation from '@/pages/Order/OrderConfirmation'
import OrderDetails from '@/pages/Order/OrderDetails'
import MyOrders from '@/pages/Order/MyOrders'
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'
import SellerRegistration from '@/pages/auth/SellerRegistration'
import Collectibles from '@/pages/Collectibles/Collectibles'
import ArtisansProducts from '@/pages/artisans/ArtisansProducts'
import ArtisanStories from '@/pages/artisans/ArtisanStories'
import ArtisanStoryDetail from '@/pages/artisans/ArtisanStoryDetail'
import AboutUs from '@/pages/AboutUs'
import ArtisanDashboard from '@/pages/artisans/artisanDashboard/ArtisanDashboard'
import ArtisanProfile from '@/pages/artisans/artisanDashboard/profile/Profile'
import ArtisanProductsManagement from '@/pages/artisans/artisanDashboard/Products/ArtisanProducts'
import AddProduct from '@/pages/artisans/artisanDashboard/Products/AddProduct'
import Content from '@/pages/artisans/artisanDashboard/ContentManagement/Content'
import Message from '@/pages/artisans/artisanDashboard/messaging/Message'
import Orders from '@/pages/artisans/artisanDashboard/Orders/Orders'
import Reviews from '@/pages/artisans/artisanDashboard/Reviews/Reviews'
import Profile from '@/pages/UserProfile/Profile'
import Admin from '@/pages/admin/Admin'
import Products from '@/pages/admin/Products'
import EditProduct from '@/pages/admin/EditProduct'
import Users from '@/pages/admin/Users/Users'
import AdminContent from '@/pages/admin/content&stories/AdminContent'
import VerificationManagement from '@/pages/admin/Users/components/VerificationManagement'
import AdminOrders from '@/pages/admin/Orders/AdminOrders'
import AdminLogin from '@/pages/admin/auth/AdminLogin'
import AboutUsManagement from '@/pages/admin/aboutusManagement/AboutUsManagement'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/product/:type/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/order-details/:orderId" element={<OrderDetails />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/become-seller" element={<SellerRegistration />} />
      <Route path="/collectibles" element={<Collectibles />} />
      <Route path="/artisans" element={<ArtisansProducts />} />
      <Route path="/artisan-stories" element={<ArtisanStories />} />
      <Route path="/artisan-stories/:id" element={<ArtisanStoryDetail />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
      <Route path="/artisan/profile" element={<ArtisanProfile />} />
      <Route path="/artisan/products" element={<ArtisanProductsManagement />} />
      <Route path="/artisan/products/add" element={<AddProduct />} />
      <Route path="/artisan/story" element={<Content />} />
      <Route path="/artisan/messages" element={<Message />} />
      <Route path="/artisan/orders" element={<Orders />} />
      <Route path="/artisan/reviews" element={<Reviews />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>} />
      <Route path="/admin/products" element={<ProtectedAdminRoute><Products /></ProtectedAdminRoute>} />
      <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><EditProduct /></ProtectedAdminRoute>} />
      <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
      <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
      <Route path="/admin/verifications" element={<ProtectedAdminRoute><VerificationManagement /></ProtectedAdminRoute>} />
      <Route path="/admin/content" element={<ProtectedAdminRoute><AdminContent /></ProtectedAdminRoute>} />
      <Route path="/admin/about-us" element={<ProtectedAdminRoute><AboutUsManagement /></ProtectedAdminRoute>} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  )
}
