import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import OrderTracking from './pages/OrderTracking'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Notifications from './pages/Notifications'
import MyLocation from './pages/MyLocation'
import ChangePassword from './pages/ChangePassword'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AdminProvider>
            <div className="min-h-screen">
              <Navbar />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/my-location" element={<MyLocation />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>
                </Routes>
              </AnimatePresence>
            </div>
          </AdminProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
