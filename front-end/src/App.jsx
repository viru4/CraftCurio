import AppRoutes from '@/routes/AppRoutes'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ChatbotProvider } from '@/contexts/ChatbotContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import Chatbot from '@/components/common/Chatbot'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ChatbotProvider>
              <AppRoutes />
              <Chatbot />
            </ChatbotProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
