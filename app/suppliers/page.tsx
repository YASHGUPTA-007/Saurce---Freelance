'use client';

import { useState, useEffect, useRef } from 'react';
import { supplierService } from '@/lib/services/supplierService';
import { Supplier } from '@/types';
import Link from 'next/link';
import { Search, Building2, MapPin, ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA' },
  { code: 'XAF', symbol: 'CFA', name: 'Central African CFA' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' }
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, selectedIndustry, selectedCountry, suppliers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setIsIndustryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image 
              src="/Saurce Icon.png" 
              alt="Saurce Logo" 
              width={36} 
              height={36}
              className="object-contain sm:w-11 sm:h-11"
            />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">Saurce</div>
              <div className="text-xs sm:text-sm text-gray-500">Sourcing in Africa made Simple</div>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency Dropdown */}
            <div className="relative hidden sm:block" ref={currencyDropdownRef}>
              <button 
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span>{selectedCurrency.symbol}</span>
                <span>{selectedCurrency.code}</span>
                <ChevronDown size={16} className={`transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        setSelectedCurrency(currency);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left transition-colors ${
                        selectedCurrency.code === currency.code 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold w-8">{currency.symbol}</span>
                        <span>
                          {currency.name} <span className="text-gray-500">({currency.code})</span>
                        </span>
                      </div>
                      {selectedCurrency.code === currency.code && (
                        <Check size={18} className="text-blue-700 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="hidden sm:flex px-3 sm:px-4 py-2 text-sm text-gray-900 font-medium border border-gray-300 rounded-md hover:bg-gray-50">
              🌐 EN
            </button>
            <Link 
              href="/admin/login" 
              className="px-3 sm:px-4 py-2 text-sm text-gray-900 font-medium hover:text-teal-600"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
          Find Trusted African Manufacturers
        </h1>
        <p className="text-gray-700 mb-8 sm:mb-12 max-w-2xl text-base sm:text-lg leading-relaxed">
          Connect directly with verified suppliers across Africa. Access detailed information on
          production capacity, pricing, and lead times.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Industry Dropdown */}
          <div className="relative" ref={industryDropdownRef}>
            <button
              onClick={() => setIsIndustryOpen(!isIndustryOpen)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white hover:bg-gray-50"
            >
              <span>{selectedIndustry}</span>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${isIndustryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isIndustryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setIsIndustryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      selectedIndustry === industry 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <span>{industry}</span>
                    {selectedIndustry === industry && (
                      <Check size={18} className="flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Country Dropdown */}
          <div className="relative" ref={countryDropdownRef}>
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white hover:bg-gray-50"
            >
              <span>{selectedCountry}</span>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCountryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsCountryOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                      selectedCountry === country 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <span>{country}</span>
                    {selectedCountry === country && (
                      <Check size={18} className="flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredSuppliers.map(supplier => (
              <Link 
                key={supplier.id} 
                href={`/suppliers/${supplier.id}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {supplier.photo ? (
                    <img 
                      src={supplier.photo} 
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                      <Building2 size={48} className="text-teal-200" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                    {supplier.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 min-h-[40px]">
                    {supplier.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="text-teal-600 flex-shrink-0" size={16} />
                      <span className="text-gray-900 font-medium">{supplier.industry}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="text-teal-600 flex-shrink-0" size={16} />
                      <span className="text-gray-900 font-medium">{supplier.country}</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Cap:</span>
                        <span className="text-gray-900 font-medium ml-1">{supplier.productionCapacity}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Lead:</span>
                        <span className="text-gray-900 font-medium ml-1">{supplier.leadTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 sm:py-12 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-700 mb-2 text-sm sm:text-base">Questions? Contact us</p>
          <a href="mailto:info@saurce.com" className="text-teal-600 font-medium hover:text-teal-700 text-sm sm:text-base">
            info@saurce.com
          </a>
          <p className="text-gray-600 text-xs sm:text-sm mt-4 sm:mt-6">
            © 2025 Saurce. Sourcing in Africa made Simple.
          </p>
        </div>
      </footer>
    </div>
  );
}