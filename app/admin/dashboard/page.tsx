'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supplierService } from '@/lib/services/supplierService';
import { Supplier } from '@/types';
import { LogOut, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    loadSuppliers();
    
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      setShowSuccessMessage(true);
      sessionStorage.removeItem('justLoggedIn');
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await supplierService.delete(id);
      loadSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/Saurce Icon.png" 
              alt="Saurce Logo" 
              width={36} 
              height={36}
              className="object-contain sm:w-11 sm:h-11"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Saurce Admin</h1>
              <p className="text-xs sm:text-sm text-gray-600">Supplier Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/suppliers" className="hidden sm:block text-gray-700 hover:text-teal-600 font-medium text-sm">
              View Portal
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-red-600 font-medium text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 shadow-lg rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 z-50 max-w-xs">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <span className="text-sm sm:text-base text-gray-900 font-medium">Login successful!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manage Suppliers ({suppliers.length})
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-teal-700 shadow-md text-sm sm:text-base"
          >
            <Plus size={20} />
            Add Supplier
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {suppliers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center text-gray-500">
                No suppliers yet. Click "Add Supplier" to get started.
              </div>
            ) : (
              suppliers.map((supplier) => (
                <div 
                  key={supplier.id}
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 truncate">
                        {supplier.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                        {supplier.industry} • {supplier.country}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 break-all">
                        {supplier.email} • {supplier.phone}
                      </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 self-end sm:self-start">
                      <button
                        onClick={() => setEditingSupplier(supplier)}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-gray-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {(showAddModal || editingSupplier) && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={() => {
            setShowAddModal(false);
            setEditingSupplier(null);
          }}
          onSave={() => {
            loadSuppliers();
            setShowAddModal(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
}

function SupplierModal({ 
  supplier, 
  onClose, 
  onSave 
}: { 
  supplier: Supplier | null; 
  onClose: () => void; 
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    description: supplier?.description || '',
    industry: supplier?.industry || '',
    country: supplier?.country || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    website: supplier?.website || '',
    productionCapacity: supplier?.productionCapacity || '',
    priceRange: supplier?.priceRange || '',
    leadTime: supplier?.leadTime || '',
    photo: supplier?.photo || '',
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.industry || !formData.country || 
        !formData.contactPerson || !formData.email || !formData.phone || 
        !formData.productionCapacity || !formData.priceRange || !formData.leadTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (supplier) {
        await supplierService.update(supplier.id, formData);
      } else {
        await supplierService.add(formData as any);
      }
      onSave();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Industry *
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Production Capacity *
                </label>
                <input
                  type="text"
                  name="productionCapacity"
                  value={formData.productionCapacity}
                  onChange={handleChange}
                  placeholder="10,000 units/mo"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Price Range *
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="$10-$50/unit"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                  Lead Time *
                </label>
                <input
                  type="text"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleChange}
                  placeholder="2-4 weeks"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-900">
                Photo URL
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Enter a valid image URL
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 shadow-md"
          >
            {supplier ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}