import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Bell, MapPin, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileOption = ({ icon: Icon, label, onClick }) => (
  <motion.button
    onClick={onClick}
    className="w-full flex items-center space-x-4 p-4 bg-red-800 text-white rounded-2xl"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      <Icon size={20} />
    </div>
    <span className="flex-1 text-left">{label}</span>
  </motion.button>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileOptions = [
    {
      icon: User,
      label: 'Edit Profile',
      onClick: () => navigate('/edit-profile')
    },
    {
      icon: Bell,
      label: 'Notifikasi',
      onClick: () => navigate('/notifications')
    },
    {
      icon: MapPin,
      label: 'Lokasi Saya',
      onClick: () => navigate('/my-location')
    },
    {
      icon: Lock,
      label: 'Ganti Password',
      onClick: () => navigate('/change-password')
    }
  ];

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
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Profile Info */}
      <motion.div 
        className="p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
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
          <div>
            <h2 className="text-xl font-bold">{user?.displayName || 'User'}</h2>
            <p className="text-gray-600">Pembeli</p>
          </div>
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          {profileOptions.map((option, index) => (
            <motion.div
              key={option.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <ProfileOption {...option} />
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-white border-2 border-red-800 text-red-800 rounded-2xl font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Keluar Akun</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
