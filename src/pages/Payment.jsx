import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, CreditCard, Smartphone, QrCode, X, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentMethods = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '/images/bank-logo.png',
    type: 'Transfer Bank',
    description: 'BCA, BNI, BRI, Mandiri',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'gopay',
    name: 'GoPay',
    icon: '/images/gopay-logo.png',
    type: 'E-Wallet',
    description: 'Bayar dengan GoPay',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'dana',
    name: 'DANA',
    icon: '/images/Dana-Logo.png',
    type: 'E-Wallet',
    description: 'Bayar dengan DANA',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'qris',
    name: 'QRIS',
    icon: '/images/qris-logo.png',
    type: 'QR Code',
    description: 'Scan QR untuk bayar',
    color: 'bg-purple-100 text-purple-800'
  }
];

const BankOptions = [
  {
    id: 'bca',
    name: 'Bank Central Asia',
    logo: '/images/bca-logo.png',
    type: 'Cek otomatis'
  },
  {
    id: 'bni',
    name: 'Bank Negara Indonesia',
    logo: '/images/bni-logo.png',
    type: 'Cek otomatis'
  },
  {
    id: 'bri',
    name: 'Bank Republik Indonesia',
    logo: '/images/bri-logo.png',
    type: 'Cek otomatis'
  },
  {
    id: 'mandiri',
    name: 'Bank Mandiri',
    logo: '/images/mandiri-logo.png',
    type: 'Cek otomatis'
  }
];

const Payment = () => {
  const navigate = useNavigate();
  const { totalAmount } = useCart();
  const [selectedPaymentType, setSelectedPaymentType] = useState('bank');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQRIS, setShowQRIS] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(300); // 5 minutes

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp');
  };

  const handlePaymentTypeSelect = (typeId) => {
    setSelectedPaymentType(typeId);
    setSelectedMethod(null);
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handlePaymentConfirm = () => {
    if (selectedPaymentType === 'qris') {
      setShowQRIS(true);
      // Start countdown timer
      const timer = setInterval(() => {
        setPaymentTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = () => {
    navigate('/order-tracking');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPaymentOptions = () => {
    if (selectedPaymentType === 'bank') {
      return (
        <div className="space-y-3">
          {BankOptions.map((bank) => (
            <motion.button
              key={bank.id}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 ${
                selectedMethod === bank.id 
                  ? 'border-red-800 bg-red-50' 
                  : 'border-gray-200'
              }`}
              onClick={() => handlePaymentMethodSelect(bank.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={bank.logo} alt={bank.name} className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{bank.name}</p>
                  <p className="text-sm text-gray-600">{bank.type}</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {selectedMethod === bank.id && (
                  <motion.div
                    className="w-3 h-3 bg-red-800 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      );
    } else if (selectedPaymentType === 'gopay' || selectedPaymentType === 'dana') {
      return (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">
              {selectedPaymentType === 'gopay' ? '💚' : '💙'}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {selectedPaymentType === 'gopay' ? 'GoPay' : 'DANA'}
          </h3>
          <p className="text-gray-600 mb-4">
            Anda akan diarahkan ke aplikasi {selectedPaymentType === 'gopay' ? 'Gojek' : 'DANA'} untuk menyelesaikan pembayaran
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Pembayaran</p>
            <p className="text-2xl font-bold text-red-800">{formatPrice(totalAmount + 10000)}</p>
          </div>
        </div>
      );
    } else if (selectedPaymentType === 'qris') {
      return (
        <div className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <QrCode size={40} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">QRIS Payment</h3>
          <p className="text-gray-600 mb-4">
            Scan QR code dengan aplikasi e-wallet atau mobile banking Anda
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600">Total Pembayaran</p>
            <p className="text-2xl font-bold text-red-800">{formatPrice(totalAmount + 10000)}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-red-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between text-white">
        <motion.button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-lg font-semibold">Payment</h1>
        <div className="w-10" />
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-t-3xl min-h-[calc(100vh-80px)] p-4">
        <div className="space-y-6">
          {/* Payment Type Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Pilih Metode Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3">
              {PaymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  className={`p-4 rounded-2xl border-2 text-left ${
                    selectedPaymentType === method.id 
                      ? 'border-red-800 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handlePaymentTypeSelect(method.id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 mb-2">
                  <img src={method.icon} alt={method.name} className="w-8 h-8" />
                    <div>
                      <p className="font-semibold text-sm">{method.name}</p>
                      <p className="text-xs text-gray-600">{method.type}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-md font-semibold mb-4">
              {PaymentMethods.find(m => m.id === selectedPaymentType)?.name}
            </h3>
            {renderPaymentOptions()}
          </div>

          {/* Payment Summary */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub-total</span>
              <span className="font-semibold">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="font-semibold">{formatPrice(10000)}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total to pay</span>
                <span>{formatPrice(totalAmount + 10000)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <motion.div 
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handlePaymentConfirm}
            className={`w-full py-4 rounded-full font-semibold text-lg ${
              (selectedPaymentType === 'bank' && !selectedMethod) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-800 text-white'
            }`}
            disabled={selectedPaymentType === 'bank' && !selectedMethod}
            whileTap={{ scale: 0.98 }}
            whileHover={selectedPaymentType !== 'bank' || selectedMethod ? { scale: 1.02 } : {}}
          >
            {selectedPaymentType === 'qris' ? 'Tampilkan QR Code' : `Bayar ${formatPrice(totalAmount + 10000)}`}
          </motion.button>
        </motion.div>
      </div>

      {/* QRIS Modal */}
      <AnimatePresence>
        {showQRIS && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Scan QR Code</h3>
                <motion.button
                  onClick={() => setShowQRIS(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
                  <Clock size={16} />
                  <span className="font-mono font-semibold">{formatTime(paymentTimer)}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white border-4 border-gray-200 rounded-2xl p-8 mb-6">
                <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* QR Code Pattern */}
                  <div className="grid grid-cols-8 gap-1 w-full h-full p-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  {/* Center Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <QrCode size={32} className="text-red-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Total Pembayaran</p>
                <p className="text-2xl font-bold text-red-800">{formatPrice(totalAmount + 10000)}</p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Cara Pembayaran:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Buka aplikasi e-wallet atau mobile banking</li>
                  <li>2. Pilih menu "Scan QR" atau "QRIS"</li>
                  <li>3. Arahkan kamera ke QR code di atas</li>
                  <li>4. Konfirmasi pembayaran di aplikasi Anda</li>
                </ol>
              </div>

              {/* Demo Complete Button */}
              <motion.button
                onClick={handlePaymentComplete}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                ✓ Simulasi Pembayaran Berhasil
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal for other methods */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Pembayaran Dikonfirmasi</h3>
                <p className="text-gray-600 mb-6">
                  Anda akan diarahkan ke aplikasi pembayaran untuk menyelesaikan transaksi
                </p>
                <motion.button
                  onClick={handlePaymentComplete}
                  className="w-full bg-red-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <img src="/images/checkout-icon.png" alt="Checkout" className="w-6 h-6" />
                  <span>Lanjutkan</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Payment;
