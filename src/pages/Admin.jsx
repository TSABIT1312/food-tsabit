import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  Tag, 
  Grid3X3, 
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Admin = () => {
  const { 
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
    deleteCategory
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('menus');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    ingredients: '',
    popular: false
  });

  const [promoForm, setPromoForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    discount: '',
    validUntil: '',
    image: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: ''
  });

  const tabs = [
    { id: 'menus', label: 'Menu Management', icon: ShoppingBag },
    { id: 'promos', label: 'Promo Management', icon: Tag },
    { id: 'categories', label: 'Categories', icon: Grid3X3 }
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (type === 'menu') {
      setMenuForm(item ? {
        ...item,
        price: item.price.toString(),
        ingredients: item.ingredients.join(', '),
        popular: item.popular || false
      } : {
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        ingredients: '',
        popular: false
      });
    } else if (type === 'promo') {
      setPromoForm(item || {
        title: '',
        subtitle: '',
        description: '',
        discount: '',
        validUntil: '',
        image: ''
      });
    } else if (type === 'category') {
      setCategoryForm(item || { name: '' });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType('');
  };

  const handleMenuSubmit = (e) => {
    e.preventDefault();
    const menuData = {
      ...menuForm,
      price: parseInt(menuForm.price),
      ingredients: menuForm.ingredients.split(',').map(ing => ing.trim()),
      popular: menuForm.popular
    };

    if (editingItem) {
      updateMenu({ ...menuData, id: editingItem.id });
    } else {
      addMenu(menuData);
    }
    closeModal();
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updatePromo({ ...promoForm, id: editingItem.id });
    } else {
      addPromo(promoForm);
    }
    closeModal();
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateCategory({ ...categoryForm, id: editingItem.id });
    } else {
      addCategory(categoryForm);
    }
    closeModal();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your restaurant data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-800 text-white px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 inline mr-2" />
                Admin Panel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-red-800 text-red-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'menus' && (
            <MenuManagement 
              menus={menus}
              onEdit={(item) => openModal('menu', item)}
              onDelete={deleteMenu}
              onAdd={() => openModal('menu')}
              formatPrice={formatPrice}
            />
          )}
          
          {activeTab === 'promos' && (
            <PromoManagement 
              promos={promos}
              onEdit={(item) => openModal('promo', item)}
              onDelete={deletePromo}
              onAdd={() => openModal('promo')}
            />
          )}
          
          {activeTab === 'categories' && (
            <CategoryManagement 
              categories={menuCategories}
              onEdit={(item) => openModal('category', item)}
              onDelete={deleteCategory}
              onAdd={() => openModal('category')}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {modalType === 'menu' && (
                <form onSubmit={handleMenuSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        value={menuForm.price}
                        onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={menuForm.category}
                        onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                        required
                      >
                        <option value="">Select Category</option>
                        {menuCategories.filter(cat => cat.name !== 'All').map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={menuForm.description}
                      onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={menuForm.image}
                      onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="https://example.com/image.jpg or /images/menu-item.jpg"
                      required
                    />
                    {menuForm.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                        <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                          <img 
                            src={menuForm.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                              e.target.nextSibling.style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                            Invalid Image URL
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
              <input
                type="text"
                value={menuForm.ingredients}
                onChange={(e) => setMenuForm({...menuForm, ingredients: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                required
              />
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="popular"
                checked={menuForm.popular}
                onChange={(e) => setMenuForm({...menuForm, popular: e.target.checked})}
                className="w-4 h-4 text-red-700 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="popular" className="text-sm text-gray-700">
                Mark as Popular
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
              )}

              {modalType === 'promo' && (
                <form onSubmit={handlePromoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={promoForm.title}
                      onChange={(e) => setPromoForm({...promoForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={promoForm.subtitle}
                      onChange={(e) => setPromoForm({...promoForm, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={promoForm.description}
                      onChange={(e) => setPromoForm({...promoForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="text"
                        value={promoForm.discount}
                        onChange={(e) => setPromoForm({...promoForm, discount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                        placeholder="25%"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        value={promoForm.validUntil}
                        onChange={(e) => setPromoForm({...promoForm, validUntil: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={promoForm.image}
                      onChange={(e) => setPromoForm({...promoForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      placeholder="https://example.com/promo-image.jpg or /images/promo-image.jpg"
                      required
                    />
                    {promoForm.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                        <div className="w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                          <img 
                            src={promoForm.image} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                              e.target.nextSibling.style.display = 'none';
                            }}
                          />
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                            Invalid Image URL
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingItem ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'category' && (
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingItem ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Menu Management Component
const MenuManagement = ({ menus, onEdit, onDelete, onAdd, formatPrice }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
      <button
        onClick={onAdd}
        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Menu Item
      </button>
    </div>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      🍽️
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                    <div className="text-sm text-gray-500">{menu.description.substring(0, 50)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {menu.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatPrice(menu.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(menu)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(menu.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Promo Management Component
const PromoManagement = ({ promos, onEdit, onDelete, onAdd }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Promotions</h2>
      <button
        onClick={onAdd}
        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Promotion
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promos.map((promo) => (
        <div key={promo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-800 text-white p-4">
            <h3 className="font-bold text-lg">{promo.title}</h3>
            <p className="text-red-100">{promo.subtitle}</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-2">{promo.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-red-800">{promo.discount} OFF</span>
              <span className="text-sm text-gray-500">Until {promo.validUntil}</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(promo)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(promo.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Category Management Component
const CategoryManagement = ({ categories, onEdit, onDelete, onAdd }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
      <button
        onClick={onAdd}
        className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </button>
    </div>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {category.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {category.name !== 'All' && (
                  <>
                    <button
                      onClick={() => onEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Admin;
