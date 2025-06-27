import React, { createContext, useContext, useState, useEffect } from 'react';
import { menuItems, promotions, categories } from '../data/menuData';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { uploadImageToStorage } from '../utils/uploadImage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [menus, setMenus] = useState(menuItems);
  const [promos, setPromos] = useState(promotions);
  const [menuCategories, setMenuCategories] = useState(categories);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribeMenus = onSnapshot(query(collection(db, 'menus')), (snapshot) => {
      setMenus(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribePromos = onSnapshot(query(collection(db, 'promos')), (snapshot) => {
      setPromos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeCategories = onSnapshot(query(collection(db, 'categories')), (snapshot) => {
      setMenuCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeMenus();
      unsubscribePromos();
      unsubscribeCategories();
    };
  }, []);

  // ===== MENU =====
  const addMenu = async (newMenu, imageFile) => {
    try {
      if (isFirebaseConfigured) {
        let imageUrl = '';
        if (imageFile) {
          imageUrl = await uploadImageToStorage(imageFile, 'menus');
        }

        await addDoc(collection(db, 'menus'), {
          ...newMenu,
          popular: newMenu.popular || false,
          image: imageUrl,
        });
      } else {
        setMenus([...menus, { ...newMenu, id: menus.length + 1 }]);
      }
    } catch (error) {
      console.error('Add menu error:', error);
    }
  };

  const updateMenu = async (updatedMenu, imageFile) => {
    try {
      if (isFirebaseConfigured) {
        const menuRef = doc(db, 'menus', updatedMenu.id);
        let imageUrl = updatedMenu.image;

        if (imageFile) {
          imageUrl = await uploadImageToStorage(imageFile, 'menus');
        }

        await updateDoc(menuRef, {
          ...updatedMenu,
          popular: updatedMenu.popular || false,
          image: imageUrl,
        });
      } else {
        setMenus(menus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu)));
      }
    } catch (error) {
      console.error('Update menu error:', error);
    }
  };

  const deleteMenu = async (menuId) => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'menus', menuId));
      } else {
        setMenus(menus.filter((menu) => menu.id !== menuId));
      }
    } catch (error) {
      console.error('Delete menu error:', error);
    }
  };

  // ===== PROMO =====
  const addPromo = async (newPromo, imageFile) => {
    try {
      if (isFirebaseConfigured) {
        let imageUrl = '';
        if (imageFile) {
          imageUrl = await uploadImageToStorage(imageFile, 'promos');
        }

        await addDoc(collection(db, 'promos'), {
          ...newPromo,
          image: imageUrl,
        });
      } else {
        setPromos([...promos, { ...newPromo, id: promos.length + 1 }]);
      }
    } catch (error) {
      console.error('Add promo error:', error);
    }
  };

  const updatePromo = async (updatedPromo, imageFile) => {
    try {
      if (isFirebaseConfigured) {
        const promoRef = doc(db, 'promos', updatedPromo.id);
        let imageUrl = updatedPromo.image;

        if (imageFile) {
          imageUrl = await uploadImageToStorage(imageFile, 'promos');
        }

        await updateDoc(promoRef, {
          ...updatedPromo,
          image: imageUrl,
        });
      } else {
        setPromos(promos.map((promo) => (promo.id === updatedPromo.id ? updatedPromo : promo)));
      }
    } catch (error) {
      console.error('Update promo error:', error);
    }
  };

  const deletePromo = async (promoId) => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'promos', promoId));
      } else {
        setPromos(promos.filter((promo) => promo.id !== promoId));
      }
    } catch (error) {
      console.error('Delete promo error:', error);
    }
  };

  // ===== CATEGORY =====
  const addCategory = async (newCategory) => {
    try {
      if (isFirebaseConfigured) {
        await addDoc(collection(db, 'categories'), {
          ...newCategory,
          slug: newCategory.name.toLowerCase(),
        });
      } else {
        setMenuCategories([
          ...menuCategories,
          {
            ...newCategory,
            id: menuCategories.length + 1,
            slug: newCategory.name.toLowerCase(),
          },
        ]);
      }
    } catch (error) {
      console.error('Add category error:', error);
    }
  };

  const updateCategory = async (updatedCategory) => {
    try {
      if (isFirebaseConfigured) {
        const categoryRef = doc(db, 'categories', updatedCategory.id);
        await updateDoc(categoryRef, {
          ...updatedCategory,
          slug: updatedCategory.name.toLowerCase(),
        });
      } else {
        setMenuCategories(
          menuCategories.map((category) =>
            category.id === updatedCategory.id
              ? { ...updatedCategory, slug: updatedCategory.name.toLowerCase() }
              : category
          )
        );
      }
    } catch (error) {
      console.error('Update category error:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      if (isFirebaseConfigured) {
        await deleteDoc(doc(db, 'categories', categoryId));
      } else {
        setMenuCategories(menuCategories.filter((category) => category.id !== categoryId));
      }
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  const value = {
    menus,
    promos,
    menuCategories,
    addMenu,
    updateMenu,
    deleteMenu,
    addPromo,
    updatePromo,
    deletePromo,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
