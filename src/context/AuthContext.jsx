import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
      case 'auth/wrong-password':
        return 'Password salah. Silakan coba lagi.';
      case 'auth/email-already-in-use':
        return 'Email sudah digunakan. Silakan gunakan email lain.';
      case 'auth/weak-password':
        return 'Password terlalu lemah. Gunakan minimal 6 karakter.';
      case 'auth/invalid-email':
        return 'Format email tidak valid.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan. Silakan coba lagi nanti.';
      case 'auth/network-request-failed':
        return 'Koneksi internet bermasalah. Silakan coba lagi.';
      default:
        if (error.message.includes('Firebase not configured')) {
          return 'Mode demo aktif. Gunakan email "demo@makanbar.com" dan password "demo123" untuk login.';
        }
        return error.message || 'Terjadi kesalahan. Silakan coba lagi.';
    }
  };

  const register = async (email, password, name) => {
    try {
      if (!isFirebaseConfigured || !auth || typeof createUserWithEmailAndPassword === 'undefined') {
        // Demo mode - create mock user
        const mockUser = {
          uid: 'demo-' + Date.now(),
          email: email,
          displayName: name,
          role: email === 'admin@makanbar.com' ? 'admin' : 'user'
        };
        setUser(mockUser);
        return { user: mockUser };
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user && updateProfile) {
        await updateProfile(userCredential.user, { displayName: name });
        // Set admin role for admin email
        const updatedUser = {
          ...userCredential.user,
          role: email === 'admin@makanbar.com' ? 'admin' : 'user'
        };
        setUser(updatedUser);
      }
      return userCredential;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const login = async (email, password) => {
    try {
      if (!isFirebaseConfigured || !auth || typeof signInWithEmailAndPassword === 'undefined') {
        // Demo mode - allow specific demo credentials
        if ((email === 'demo@makanbar.com' && password === 'demo123') ||
            (email === 'admin@makanbar.com' && password === 'admin123')) {
          const mockUser = {
            uid: 'demo-' + Date.now(),
            email: email,
            displayName: email === 'admin@makanbar.com' ? 'Admin User' : 'Demo User',
            role: email === 'admin@makanbar.com' ? 'admin' : 'user'
          };
          setUser(mockUser);
          return { user: mockUser };
        } else {
          throw new Error('Invalid credentials. Use demo@makanbar.com/demo123 or admin@makanbar.com/admin123');
        }
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Set admin role for admin email
      const updatedUser = {
        ...userCredential.user,
        role: email === 'admin@makanbar.com' ? 'admin' : 'user'
      };
      setUser(updatedUser);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth && typeof signOut === 'function') {
        await signOut(auth);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (auth?.currentUser && updateProfile) {
        await updateProfile(auth.currentUser, updates);
        setUser(prev => ({ ...prev, ...updates }));
      } else {
        setUser(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (isFirebaseConfigured && auth && typeof onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // Set admin role for admin email
            const updatedUser = {
              ...user,
              role: user.email === 'admin@makanbar.com' ? 'admin' : 'user'
            };
            setUser(updatedUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth state listener error:', error);
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};