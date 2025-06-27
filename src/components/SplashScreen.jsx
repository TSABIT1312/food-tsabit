import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Logo/Brand */}
      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        <h1 className="text-4xl font-bold text-red-800 mb-4">MakanBar</h1>
        <div className="w-24 h-24 mx-auto bg-red-800 rounded-full flex items-center justify-center">
          <span className="text-4xl text-white">🍔</span>
        </div>
      </motion.div>

      {/* Get Started Button */}
      <motion.button
        className="bg-red-800 text-white px-8 py-4 rounded-full font-semibold text-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 0.5,
          duration: 0.6,
          ease: "easeOut"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get started
      </motion.button>

      {/* Location Illustration */}
      <motion.div
        className="mt-12 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 0.8,
          duration: 0.6,
          ease: "easeOut"
        }}
      >
        <div className="w-64 h-64 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-8xl">📍</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">
          Get our restaurant near you
        </h2>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
