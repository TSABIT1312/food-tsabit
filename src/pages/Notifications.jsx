import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, BellOff, ShoppingBag, Truck, Star, Gift } from 'lucide-react';

const NotificationItem = ({ icon: Icon, title, description, time, isRead, onClick }) => (
  <motion.div
    onClick={onClick}
    className={`p-4 border-b border-gray-200 cursor-pointer ${isRead ? 'bg-white' : 'bg-blue-50'}`}
    whileHover={{ backgroundColor: '#f9fafb' }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-start space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-gray-200' : 'bg-red-800 text-white'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      </div>
      {!isRead && (
        <div className="w-2 h-2 bg-red-800 rounded-full"></div>
      )}
    </div>
  </motion.div>
);

const NotificationSettings = ({ icon: Icon, title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-red-800 text-white rounded-full flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <motion.button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-red-800' : 'bg-gray-300'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
        animate={{ x: enabled ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  </div>
);

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: ShoppingBag,
      title: 'Pesanan Dikonfirmasi',
      description: 'Pesanan #12345 telah dikonfirmasi dan sedang diproses',
      time: '2 jam yang lalu',
      isRead: false
    },
    {
      id: 2,
      icon: Truck,
      title: 'Pesanan Dalam Perjalanan',
      description: 'Driver sedang menuju lokasi Anda. Estimasi 15 menit',
      time: '5 jam yang lalu',
      isRead: false
    },
    {
      id: 3,
      icon: Star,
      title: 'Berikan Rating',
      description: 'Bagaimana pengalaman Anda dengan pesanan terakhir?',
      time: '1 hari yang lalu',
      isRead: true
    },
    {
      id: 4,
      icon: Gift,
      title: 'Promo Spesial!',
      description: 'Dapatkan diskon 25% untuk pembelian minimal Rp 50.000',
      time: '2 hari yang lalu',
      isRead: true
    }
  ]);

  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newMenus: false,
    reminders: true
  });

  const handleNotificationClick = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleSettingToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <h1 className="text-lg font-semibold">Notifikasi</h1>
        <div className="w-10" />
      </div>

      {/* Tabs */}
      <div className="bg-white p-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <motion.button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-red-800 text-white' 
                : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Notifikasi {unreadCount > 0 && `(${unreadCount})`}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'settings' 
                ? 'bg-red-800 text-white' 
                : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Pengaturan
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'notifications' ? (
          <div className="bg-white">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NotificationItem
                    {...notification}
                    onClick={() => handleNotificationClick(notification.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-16"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <BellOff size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada notifikasi</h3>
                <p className="text-gray-600 text-center">Notifikasi akan muncul di sini ketika ada update pesanan atau promo baru</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <NotificationSettings
                icon={ShoppingBag}
                title="Update Pesanan"
                description="Notifikasi status pesanan dan pengiriman"
                enabled={settings.orderUpdates}
                onToggle={() => handleSettingToggle('orderUpdates')}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <NotificationSettings
                icon={Gift}
                title="Promo & Penawaran"
                description="Dapatkan info promo dan diskon terbaru"
                enabled={settings.promotions}
                onToggle={() => handleSettingToggle('promotions')}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <NotificationSettings
                icon={Star}
                title="Menu Baru"
                description="Notifikasi ketika ada menu baru tersedia"
                enabled={settings.newMenus}
                onToggle={() => handleSettingToggle('newMenus')}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <NotificationSettings
                icon={Bell}
                title="Pengingat"
                description="Pengingat untuk rating dan review"
                enabled={settings.reminders}
                onToggle={() => handleSettingToggle('reminders')}
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;

