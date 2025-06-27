import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState('preparing'); // preparing, delivering, delivered, completed

  useEffect(() => {
    // Clear cart when order is placed
    clearCart();

    // Simulate order status progression
    const statusProgression = [
      { status: 'preparing', delay: 0 },
      { status: 'delivering', delay: 3000 },
      { status: 'delivered', delay: 6000 },
      { status: 'completed', delay: 9000 }
    ];

    // Store all timeouts to clean them up later
    const timeouts = [];

    statusProgression.forEach(({ status, delay }) => {
      const timeout = setTimeout(() => {
        setOrderStatus(status);
      }, delay);
      timeouts.push(timeout);
    });

    // Cleanup function to clear all timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Remove clearCart from dependencies since it's stable

  const getStatusContent = () => {
    switch (orderStatus) {
      case 'preparing':
        return {
          title: 'we are preparing your order',
          illustration: '👨‍🍳',
          description: 'Your delicious meal is being prepared with care'
        };
      case 'delivering':
        return {
          title: 'Your order is being delivered to your location',
          illustration: '🛵',
          description: 'Our delivery partner is on the way to your location'
        };
      case 'delivered':
        return {
          title: 'Your order has been delivered',
          illustration: '📦',
          description: 'Please check your order and enjoy your meal'
        };
      case 'completed':
        return {
          title: 'Your payment is done!!',
          illustration: '🤝',
          description: 'Thank you for choosing MakanBar. Enjoy your meal!'
        };
      default:
        return {
          title: 'Processing your order',
          illustration: '⏳',
          description: 'Please wait while we process your order'
        };
    }
  };

  const statusContent = getStatusContent();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between">
        <motion.button
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold">Order Status</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Order Status Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <motion.div 
          className="text-center"
          key={orderStatus}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Illustration */}
          <motion.div 
            className="w-48 h-48 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              y: [0, -10, 0],
              rotate: orderStatus === 'delivering' ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 1, ease: "easeInOut" }
            }}
          >
            <span className="text-8xl">{statusContent.illustration}</span>
          </motion.div>

          {/* Status Title */}
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-4 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statusContent.title}
          </motion.h2>

          {/* Status Description */}
          <motion.p 
            className="text-gray-600 mb-8 max-w-sm mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {statusContent.description}
          </motion.p>

          {/* Progress Indicator */}
          <motion.div 
            className="flex justify-center space-x-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {['preparing', 'delivering', 'delivered', 'completed'].map((status, index) => (
              <motion.div
                key={status}
                className={`w-3 h-3 rounded-full ${
                  ['preparing', 'delivering', 'delivered', 'completed'].indexOf(orderStatus) >= index
                    ? 'bg-red-800'
                    : 'bg-gray-300'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              />
            ))}
          </motion.div>

          {/* Action Button */}
          {orderStatus === 'completed' && (
            <motion.button
              onClick={handleBackToHome}
              className="bg-red-800 text-white px-8 py-3 rounded-full font-semibold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Again
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Order Details Card */}
      {orderStatus !== 'completed' && (
        <motion.div 
          className="bg-white m-4 rounded-2xl p-4 shadow-lg"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estimated delivery time</p>
              <p className="font-semibold text-lg">15-25 minutes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">#MB{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderTracking;
