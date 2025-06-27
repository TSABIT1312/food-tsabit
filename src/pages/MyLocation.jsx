import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Heart, Edit3, Trash2, Navigation } from 'lucide-react';

const LocationCard = ({ location, isSelected, onSelect, onEdit, onDelete }) => (
  <motion.div
    className={`p-4 rounded-2xl border-2 cursor-pointer ${
      isSelected 
        ? 'border-red-800 bg-red-50' 
        : 'border-gray-200 bg-white'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-red-800 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {location.type === 'home' && <Home size={20} />}
          {location.type === 'work' && <Briefcase size={20} />}
          {location.type === 'other' && <Heart size={20} />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{location.label}</h3>
          <p className="text-sm text-gray-600 mt-1">{location.address}</p>
          <p className="text-xs text-gray-500 mt-1">{location.details}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(location);
          }}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <Edit3 size={14} className="text-gray-600" />
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(location.id);
          }}
          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={14} className="text-red-600" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const MyLocation = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locations, setLocations] = useState([
    {
      id: 1,
      type: 'home',
      label: 'Rumah',
      address: 'Jl. Merdeka No. 123, Jakarta Pusat',
      details: 'Dekat dengan Monas, sebelah kiri jalan',
      coordinates: { lat: -6.2088, lng: 106.8456 }
    },
    {
      id: 2,
      type: 'work',
      label: 'Kantor',
      address: 'Jl. Sudirman No. 456, Jakarta Selatan',
      details: 'Gedung ABC lantai 15, lobby utama',
      coordinates: { lat: -6.2297, lng: 106.8253 }
    }
  ]);

  useEffect(() => {
    // Set default selected location
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0]);
    }
  }, [locations, selectedLocation]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            address: `Lokasi saat ini (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          });
          alert('Lokasi berhasil didapatkan!');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.');
        }
      );
    } else {
      alert('Geolocation tidak didukung oleh browser ini.');
    }
  };

  const handleAddLocation = () => {
    // Navigate to add location page (you can create this later)
    alert('Fitur tambah alamat akan segera tersedia!');
  };

  const handleEditLocation = (location) => {
    // Navigate to edit location page
    alert(`Edit alamat: ${location.label}`);
  };

  const handleDeleteLocation = (locationId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      setLocations(prev => prev.filter(loc => loc.id !== locationId));
      if (selectedLocation?.id === locationId) {
        setSelectedLocation(locations.find(loc => loc.id !== locationId) || null);
      }
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };

  const handleSaveSelection = () => {
    if (selectedLocation) {
      // Save selected location to context or localStorage
      localStorage.setItem('selectedDeliveryLocation', JSON.stringify(selectedLocation));
      alert(`Alamat pengiriman diatur ke: ${selectedLocation.label}`);
      navigate(-1);
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
        <h1 className="text-lg font-semibold">Lokasi Saya</h1>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-4">
        {/* Current Location */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Lokasi Saat Ini</h2>
              <motion.button
                onClick={getCurrentLocation}
                className="flex items-center space-x-2 px-3 py-1 bg-red-800 text-white rounded-full text-sm"
                whileTap={{ scale: 0.95 }}
              >
                <Navigation size={14} />
                <span>Deteksi</span>
              </motion.button>
            </div>
            {currentLocation ? (
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-red-800" />
                <p className="text-sm text-gray-600">{currentLocation.address}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Tap "Deteksi" untuk mendapatkan lokasi saat ini</p>
            )}
          </div>
        </motion.div>

        {/* Saved Locations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Alamat Tersimpan</h2>
            <motion.button
              onClick={handleAddLocation}
              className="flex items-center space-x-2 px-3 py-1 bg-red-800 text-white rounded-full text-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={14} />
              <span>Tambah</span>
            </motion.button>
          </div>

          <div className="space-y-3">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <LocationCard
                  location={location}
                  isSelected={selectedLocation?.id === location.id}
                  onSelect={() => handleSelectLocation(location)}
                  onEdit={handleEditLocation}
                  onDelete={handleDeleteLocation}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 border border-red-200 p-4 rounded-2xl"
          >
            <h3 className="font-medium text-red-800 mb-2">Alamat Pengiriman Terpilih</h3>
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-red-600" />
              <p className="text-sm text-red-700">{selectedLocation.label} - {selectedLocation.address}</p>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.button
          onClick={handleSaveSelection}
          disabled={!selectedLocation}
          className="w-full bg-red-800 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: selectedLocation ? 0.98 : 1 }}
          whileHover={{ scale: selectedLocation ? 1.02 : 1 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Gunakan Alamat Ini
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MyLocation;
