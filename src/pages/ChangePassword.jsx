import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PasswordRequirement = ({ met, text }) => (
  <div className={`flex items-center space-x-2 text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
    <CheckCircle size={16} className={met ? 'text-green-600' : 'text-gray-400'} />
    <span>{text}</span>
  </div>
);

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const passwordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(req => req);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Password saat ini harus diisi';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password baru harus diisi';
    } else if (!isPasswordValid) {
      newErrors.newPassword = 'Password tidak memenuhi persyaratan';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword !== '') {
      newErrors.newPassword = 'Password baru harus berbeda dari password saat ini';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would call an API to change the password
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Password berhasil diubah!');
      navigate('/profile');
    } catch (error) {
      console.error('Change password error:', error);
      setErrors({ submit: 'Gagal mengubah password. Silakan coba lagi.' });
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
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold">Ganti Password</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Security Info */}
        <motion.div 
          className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <Shield className="text-blue-600" size={24} />
            <div>
              <h3 className="font-medium text-blue-800">Keamanan Akun</h3>
              <p className="text-sm text-blue-600 mt-1">
                Gunakan password yang kuat untuk melindungi akun Anda
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Saat Ini
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-red-800 focus:border-transparent ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-red-800 focus:border-transparent ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <motion.div 
              className="bg-gray-50 p-4 rounded-2xl space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-3">Persyaratan Password:</h4>
              <PasswordRequirement 
                met={passwordRequirements.minLength} 
                text="Minimal 8 karakter" 
              />
              <PasswordRequirement 
                met={passwordRequirements.hasUppercase} 
                text="Mengandung huruf besar (A-Z)" 
              />
              <PasswordRequirement 
                met={passwordRequirements.hasLowercase} 
                text="Mengandung huruf kecil (a-z)" 
              />
              <PasswordRequirement 
                met={passwordRequirements.hasNumber} 
                text="Mengandung angka (0-9)" 
              />
              <PasswordRequirement 
                met={passwordRequirements.hasSpecial} 
                text="Mengandung karakter khusus (!@#$%^&*)" 
              />
            </motion.div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-red-800 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 
                  passwordsMatch ? 'border-green-500' : 'border-gray-300'
                }`}
                placeholder="Konfirmasi password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
            {passwordsMatch && formData.confirmPassword && (
              <p className="text-green-500 text-sm mt-1">Password cocok ✓</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-2xl">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !isPasswordValid || !passwordsMatch || !formData.currentPassword}
            className="w-full bg-red-800 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={{ scale: loading ? 1 : 0.98 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
          >
            {loading ? 'Mengubah Password...' : 'Ubah Password'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ChangePassword;
