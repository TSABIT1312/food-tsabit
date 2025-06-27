import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { menus } = useAdmin();

  useEffect(() => {
    console.log('ProductDetails - ID from URL:', id);
    console.log('ProductDetails - Available menus:', menus);
    
    if (id && menus.length > 0) {
      // Try to find product by string ID first (Firebase), then by numeric ID (local data)
      let foundProduct = menus.find(item => {
        console.log('Comparing item.id:', item.id, 'with id:', id);
        return item.id === id || item.id === Number(id);
      });
      
      console.log('ProductDetails - Found product:', foundProduct);
      setProduct(foundProduct);
    }
  }, [id, menus]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success animation or notification
    navigate('/cart');
  };

  const totalPrice = product.price * quantity;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold">Details</h1>
        <motion.button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isFavorite ? 'bg-red-800 text-white' : 'bg-gray-100 text-gray-600'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Product Image */}
      <motion.div 
        className="relative h-64 bg-white flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-48 h-48 rounded-full object-cover"
        />
        {/* Small product images */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover mb-2"
          />
        </div>
      </motion.div>

      {/* Product Info */}
      <div className="p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-red-800">{formatPrice(product.price)}</p>
            <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-sm">
              <motion.button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </motion.button>
              <span className="font-semibold text-lg">{quantity}</span>
              <motion.button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-2">About food</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {product.ingredients && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add to Cart Button */}
      <motion.div 
        className="fixed bottom-20 left-4 right-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{formatPrice(totalPrice)}</p>
            </div>
            <motion.button
              onClick={handleAddToCart}
              className="bg-red-800 text-white px-8 py-3 rounded-full font-semibold"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              Add to cart
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;
