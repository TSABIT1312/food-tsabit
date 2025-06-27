import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, X, MoreVertical } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalAmount, 
    updateQuantity, 
    removeFromCart, 
    getCartItemsCount 
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp');
  };

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <motion.div 
        className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-white p-4 flex items-center justify-between z-10">
          <motion.button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-lg font-semibold">Cart</h1>
          <button className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Empty Cart Illustration */}
        <motion.div 
          className="text-center mt-20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-48 h-48 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">your cart</h2>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">is empty</h3>
          <motion.button
            onClick={() => navigate('/menu')}
            className="bg-red-800 text-white px-8 py-3 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Menu
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold">Cart</h1>
        <button className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="food-card flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-white/80">{formatPrice(item.price)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus size={12} />
                  </motion.button>
                  <span className="font-semibold">{item.quantity}</span>
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={12} />
                  </motion.button>
                </div>
                
                <motion.button
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total and Checkout */}
      <motion.div 
        className="fixed bottom-20 left-4 right-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total amount</span>
            <span className="text-lg font-bold">{formatPrice(totalAmount)}</span>
          </div>
          <motion.button
            onClick={handleCheckout}
            className="w-full bg-red-800 text-white py-4 rounded-full font-semibold text-lg"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
          >
            Checkout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
