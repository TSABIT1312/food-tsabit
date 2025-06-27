import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Minus, Plus, X, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    items, 
    itemTotal, 
    deliveryFee, 
    promoDiscount, 
    totalAmount, 
    updateQuantity, 
    removeFromCart, 
    setPromoCode,
    promoCode 
  } = useCart();
  
  const [promoInput, setPromoInput] = useState('');

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

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      setPromoCode(promoInput.trim());
      setPromoInput('');
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

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
        <h1 className="text-lg font-semibold">Checkout</h1>
        <button className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="food-card flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
      </div>

      {/* Promo Code Section */}
      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-800 text-white rounded-lg flex items-center justify-center">
              <Gift size={20} />
            </div>
            <input
              type="text"
              placeholder="Promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg"
            />
            <motion.button
              onClick={handleApplyPromo}
              className="bg-gray-100 px-4 py-2 rounded-lg font-medium"
              whileTap={{ scale: 0.95 }}
            >
              Apply
            </motion.button>
          </div>
          {promoCode && (
            <div className="mt-2 text-green-600 text-sm">
              Promo code "{promoCode}" applied! 10% discount
            </div>
          )}
        </div>
      </motion.div>

      {/* Order Summary */}
      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Item total</span>
            <span className="font-semibold">{formatPrice(itemTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-semibold">{formatPrice(deliveryFee)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo discount</span>
              <span>-{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <div className="border-t border-dashed border-gray-300 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proceed Button */}
      <motion.div 
        className="fixed bottom-20 left-4 right-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={handleProceedToPayment}
          className="w-full bg-red-800 text-white py-4 rounded-full font-semibold text-lg"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          Proceed to Payment
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Checkout;
