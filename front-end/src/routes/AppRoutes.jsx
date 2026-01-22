import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Eagerly load critical pages
import Landing from '@/pages/Landing'
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'
import AdminLogin from '@/pages/admin/auth/AdminLogin'

// Lazy load non-critical pages
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Cart = lazy(() => import('@/pages/Cart'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const CheckOut = lazy(() => import('@/pages/Order/CheckOut'))
const OrderConfirmation = lazy(() => import('@/pages/Order/OrderConfirmation'))
const OrderDetails = lazy(() => import('@/pages/Order/OrderDetails'))
const MyOrders = lazy(() => import('@/pages/Order/MyOrders'))
const SellerRegistration = lazy(() => import('@/pages/auth/SellerRegistration'))
const Collectibles = lazy(() => import('@/pages/Collectibles/Collectibles'))
const ArtisansProducts = lazy(() => import('@/pages/artisans/ArtisansProducts'))
const ArtisanStories = lazy(() => import('@/pages/artisans/ArtisanStories'))
const ArtisanStoryDetail = lazy(() => import('@/pages/artisans/ArtisanStoryDetail'))
const AboutUs = lazy(() => import('@/pages/AboutUs'))
const Auctions = lazy(() => import('@/pages/Auctions/Auctions'))
const CollectorDashboard = lazy(() => import('@/pages/collector/CollectorDashboardPage'))
const ArtisanDashboard = lazy(() => import('@/pages/artisans/artisanDashboard/ArtisanDashboard'))
const ArtisanProfile = lazy(() => import('@/pages/artisans/artisanDashboard/profile/Profile'))
const ArtisanProductsManagement = lazy(() => import('@/pages/artisans/artisanDashboard/Products/ArtisanProducts'))
const AddProduct = lazy(() => import('@/pages/artisans/artisanDashboard/Products/AddProduct'))
const Content = lazy(() => import('@/pages/artisans/artisanDashboard/ContentManagement/Content'))
const Message = lazy(() => import('@/pages/artisans/artisanDashboard/messaging/Message'))
const Orders = lazy(() => import('@/pages/artisans/artisanDashboard/Orders/Orders'))
const Reviews = lazy(() => import('@/pages/artisans/artisanDashboard/Reviews/Reviews'))
const Profile = lazy(() => import('@/pages/UserProfile/Profile'))
const Admin = lazy(() => import('@/pages/admin/Admin'))
const Products = lazy(() => import('@/pages/admin/Products'))
const EditProduct = lazy(() => import('@/pages/admin/EditProduct'))
const Categories = lazy(() => import('@/pages/admin/Categories/Categories'))
const Users = lazy(() => import('@/pages/admin/Users/Users'))
const AdminContent = lazy(() => import('@/pages/admin/content&stories/AdminContent'))
const VerificationManagement = lazy(() => import('@/pages/admin/Users/components/VerificationManagement'))
const AdminOrders = lazy(() => import('@/pages/admin/Orders/AdminOrders'))
const AboutUsManagement = lazy(() => import('@/pages/admin/aboutusManagement/AboutUsManagement'))
const ProtectedRoute = lazy(() => import('@/components/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })))
const ProtectedAdminRoute = lazy(() => import('@/components/ProtectedAdminRoute'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
      <Route path="/auctions" element={<Auctions />} />
      <Route path="/auctions/:auctionId" element={<Auctions />} />
      <Route path="/collector/dashboard" element={<CollectorDashboard />} />
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
      <Route path="/admin/categories" element={<ProtectedAdminRoute><Categories /></ProtectedAdminRoute>} />
      <Route path="/admin/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
      <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
      <Route path="/admin/verifications" element={<ProtectedAdminRoute><VerificationManagement /></ProtectedAdminRoute>} />
      <Route path="/admin/content" element={<ProtectedAdminRoute><AdminContent /></ProtectedAdminRoute>} />
      <Route path="/admin/about-us" element={<ProtectedAdminRoute><AboutUsManagement /></ProtectedAdminRoute>} />
      <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Suspense>
  )
}
