// app/suppliers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supplierService } from '@/lib/services/supplierService';
import { Supplier } from '@/types';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, selectedIndustry, selectedCountry, suppliers]);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== 'All Industries') {
      filtered = filtered.filter(s => s.industry === selectedIndustry);
    }

    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(s => s.country === selectedCountry);
    }

    setFilteredSuppliers(filtered);
  };

  const industries = ['All Industries', ...new Set(suppliers.map(s => s.industry))];
  const countries = ['All Countries', ...new Set(suppliers.map(s => s.country))];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/Saurce Icon.png" 
              alt="Saurce Logo" 
              width={44} 
              height={44}
              className="object-contain"
            />
            <div>
              <div className="text-2xl font-bold text-gray-900">Saurce</div>
              <div className="text-sm text-gray-500">Sourcing in Africa made Simple</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-md hover:bg-gray-50">
              $ USD
            </button>
            <button className="px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-md hover:bg-gray-50">
              🌐 EN
            </button>
            <Link 
              href="/admin/login" 
              className="px-4 py-2 text-gray-900 font-medium hover:text-teal-600"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Find Trusted African Manufacturers
        </h1>
        <p className="text-gray-700 mb-12 max-w-2xl text-lg leading-relaxed">
          Connect directly with verified suppliers across Africa. Access detailed information on
          production capacity, pricing, and lead times.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
          >
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
          >
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-900 text-lg">Loading...</div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-700 text-lg">No suppliers found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <Link 
                key={supplier.id} 
                href={`/suppliers/${supplier.id}`}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 relative">
                  {supplier.photo && (
                    <img 
                      src={supplier.photo} 
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{supplier.name}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                    {supplier.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-700 mb-2">Questions? Contact us</p>
          <a href="mailto:Info@saurce.com" className="text-teal-600 font-medium hover:text-teal-700">
            Info@saurce.com
          </a>
          <p className="text-gray-600 text-sm mt-6">
            © 2025 Saurce. Sourcing in Africa made Simple.
          </p>
        </div>
      </footer>
    </div>
  );
}