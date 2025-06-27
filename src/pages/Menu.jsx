import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const Menu = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { menus, menuCategories } = useAdmin();
  const [filteredItems, setFilteredItems] = useState(menus);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    let filtered = menus;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery, menus]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality is handled by useEffect
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    // Show animation or notification here
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp');
  };

  return (
    <motion.div 
      className="min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Search Bar */}
      <div className="relative mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Find what you want"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-800"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Search className="text-gray-500" size={20} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="absolute right-12 top-1/2 transform -translate-y-1/2"
          >
            <ShoppingCart className="text-gray-500" size={20} />
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
      {menuCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.slug
                ? 'bg-red-800 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid gap-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="food-card flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-white/80">{formatPrice(item.price)}</p>
              </div>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
              className="bg-white/20 p-2 rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart size={20} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items found</p>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
