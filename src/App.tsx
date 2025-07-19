import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import blink from './blink/client'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMenus from './pages/admin/AdminMenus'
import AdminPages from './pages/admin/AdminPages'
import { Toaster } from './components/ui/toaster'

export interface User {
  id: string
  email: string
  displayName?: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  pricePerKg: number
  weightKg: number
  totalPrice: number
  imageUrl?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ka'>('en')
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('piwkina-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('piwkina-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart_${Date.now()}_${Math.random()}`
    }
    setCart(prev => [...prev, newItem])
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ka' : 'en')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-primary mb-4">Piwkina.ge</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the Piwkina.ge e-commerce platform
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header 
          user={user} 
          language={language} 
          onToggleLanguage={toggleLanguage}
          cartItemsCount={cart.length}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage language={language} addToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage language={language} addToCart={addToCart} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/cart" element={
              <CartPage 
                language={language} 
                cart={cart} 
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/menus" element={<AdminMenus />} />
            <Route path="/admin/pages" element={<AdminPages />} />
          </Routes>
        </main>
        
        <Footer language={language} />
        <Toaster />
      </div>
    </Router>
  )
}

export default App