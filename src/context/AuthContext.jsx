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
      if (!isFirebaseConfigured || !auth || typeof auth.createUserWithEmailAndPassword === 'undefined') {
        throw new Error('Firebase not configured');
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user && updateProfile) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      return userCredential;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const login = async (email, password) => {
    try {
      if (!isFirebaseConfigured || !auth || typeof auth.signInWithEmailAndPassword === 'undefined') {
        throw new Error('Firebase not configured');
      }
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth && typeof auth.signOut === 'function') {
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
          setUser(user);
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