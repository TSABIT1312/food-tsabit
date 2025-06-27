import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, ArrowRight, Pizza, Coffee, Utensils } from 'lucide-react';
import { promotions, menuItems } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { menuCategories: categories } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const popularItems = menuItems.filter(item => item.popular);

  const filteredItems = selectedCategory === 'all'
    ? popularItems
    : popularItems.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    navigate(`/menu?category=${slug}`);
  };

  const handleViewMenu = () => {
    navigate('/menu');
  };

  // Category icons mapping
  const categoryIcons = {
    'all': ShoppingBag,
    'burger': Utensils,
    'pizza': Pizza,
    'breakfast': Coffee,
    'hotdog': Utensils
  };

  return (
    <motion.div 
      className="min-h-screen p-4 pt-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-br from-red-800 to-red-700 text-white rounded-2xl p-8 mb-8 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Delicious Food<br />At Your Doorstep</h1>
          <p className="text-lg opacity-90 mb-6">Order your favorite meals with just a few clicks</p>
          <motion.button
            onClick={handleViewMenu}
            className="bg-white text-red-800 px-8 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View Menu</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <ShoppingBag size={256} />
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <motion.button
            onClick={handleViewMenu}
            className="text-red-800 flex items-center space-x-1 font-medium hover:text-red-900"
            whileHover={{ x: 5 }}
          >
            <span>View All</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || ShoppingBag;
            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`p-6 rounded-xl text-center transition-colors flex flex-col items-center space-y-2 ${
                  selectedCategory === category.slug
                    ? 'bg-red-800 text-white'
                    : 'bg-white text-gray-800 hover:bg-red-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Menu</h2>
          <motion.button
            onClick={handleViewMenu}
            className="text-red-800 flex items-center space-x-1 font-medium hover:text-red-900"
            whileHover={{ x: 5 }}
          >
            <span>View All</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ y: -5 }}
            >
          <div className="relative mb-4 bg-gray-100 rounded-xl h-48 flex items-center justify-center overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-2 right-2 bg-red-800 text-white px-3 py-1 rounded-full text-sm font-medium">
              {item.category}
            </div>
          </div>
              <h3 className="text-lg font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Rp{item.price.toLocaleString()}</span>
                <motion.button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
        <motion.div 
          className="grid gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {promotions.map((promo) => (
            <motion.div
              key={promo.id}
              className="bg-gradient-to-r from-red-800 to-red-700 text-white rounded-2xl p-8 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative z-10">
                <span className="text-sm font-medium bg-white/20 px-4 py-1 rounded-full">Limited Time</span>
                <h3 className="text-3xl font-bold mt-4 mb-2">{promo.title}</h3>
                <p className="text-lg opacity-90">{promo.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold">{promo.discount}</span>
                  <span className="text-xl ml-1">OFF</span>
                </div>
                <motion.button
                  onClick={handleViewMenu}
                  className="mt-6 bg-white text-red-800 px-6 py-2 rounded-full font-medium inline-flex items-center space-x-2 hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Order Now</span>
                  <ArrowRight size={20} />
                </motion.button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-full opacity-10">
                <ShoppingBag size={256} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Food Delivery Banner */}
      <motion.section 
        className="bg-gradient-to-br from-red-800 to-red-700 text-white rounded-2xl p-8 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">FOOD DELIVERY</h2>
            <p className="text-lg opacity-90 mb-6">Order your favorite food now!</p>
            <motion.button
              onClick={handleViewMenu}
              className="bg-white text-red-800 px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Order Now</span>
              <ArrowRight size={20} />
            </motion.button>
          </div>
          <motion.div 
            className="text-white opacity-75"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <ShoppingBag size={96} />
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
