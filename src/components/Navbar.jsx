import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Menu as MenuIcon, 
  ShoppingCart, 
  User,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  X,
  AlignJustify,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const cartItemsCount = getCartItemsCount();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/menu', icon: MenuIcon, label: 'Menu' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav 
        className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">MakanBar</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-red-800 bg-red-50' 
                        : 'text-gray-600 hover:text-red-800 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari makanan favorit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                />
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {user && (
                <motion.button
                  onClick={() => handleNavigation('/notifications')}
                  className="relative p-2 text-gray-600 hover:text-red-800 hover:bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </motion.button>
              )}

              {/* Cart */}
              <motion.button
                onClick={() => handleNavigation('/cart')}
                className="relative p-2 text-gray-600 hover:text-red-800 hover:bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {cartItemsCount}
                  </motion.div>
                )}
              </motion.button>

              {/* User Profile */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-800 hover:bg-gray-50 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.displayName?.[0] || user.email?.[0] || '?'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user.displayName || 'User'}</span>
                    <ChevronDown size={16} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          onClick={() => {
                            handleNavigation('/profile');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </button>
                        {user.role === 'admin' && (
                          <>
                            <hr className="my-1" />
                            <button
                              onClick={() => {
                                handleNavigation('/admin');
                                setIsProfileDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Settings size={16} />
                              <span>Admin Panel</span>
                            </button>
                          </>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => handleNavigation('/login')}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-600 hover:text-red-800 hover:bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <AlignJustify size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-gray-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-2 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="lg:hidden mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Cari makanan favorit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                    />
                  </div>
                </form>

                {/* Mobile Navigation Items */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-red-800 bg-red-50' 
                          : 'text-gray-600 hover:text-red-800 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Admin Menu Item for Mobile */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === '/admin'
                        ? 'text-red-800 bg-red-50'
                        : 'text-gray-600 hover:text-red-800 hover:bg-gray-50'
                    }`}
                  >
                    <Settings size={18} />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Overlay for profile dropdown */}
      <AnimatePresence>
        {isProfileDropdownOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileDropdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
