import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 flex items-center">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold ml-4">Create Account</h1>
      </div>

      {/* Illustration Section */}
      <motion.div 
        className="flex items-center justify-center p-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-6xl">🍔</span>
          </div>
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join MakanBar
          </motion.h2>
          <motion.p 
            className="text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Create your account to start ordering
          </motion.p>
        </div>
      </motion.div>

      {/* Register Form */}
      <motion.div 
        className="bg-white rounded-t-3xl p-6 shadow-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-800 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-800 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="text-red-600 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Register Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-red-800 text-sm font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
