import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

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

    try {
      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone
      });
      
      // Show success message (you can implement a toast notification here)
      alert('Profile berhasil diperbarui!');
      navigate('/profile');
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Gagal memperbarui profile. Silakan coba lagi.');
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
        <h1 className="text-lg font-semibold">Edit Profile</h1>
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Profile Picture Section */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-800 text-white flex items-center justify-center text-2xl">
                  {user?.displayName?.[0] || user?.email?.[0] || '?'}
                </div>
              )}
            </div>
            <motion.button
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => alert('Fitur upload foto akan segera tersedia!')}
            >
              <Camera size={16} />
            </motion.button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Tap untuk mengubah foto</p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          {/* Email Input (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-2xl cursor-not-allowed"
                placeholder="Email"
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-red-800 focus:border-transparent"
                placeholder="Masukkan nomor telepon"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-red-800 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 mt-8"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default EditProfile;
