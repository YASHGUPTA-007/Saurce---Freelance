// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supplierService } from '@/lib/services/supplierService';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [stats, setStats] = useState({ countries: 0, suppliers: 0, industries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const suppliers = await supplierService.getAll();
      
      // Calculate actual stats from supplier data
      const uniqueCountries = new Set(suppliers.map(s => s.country)).size;
      const uniqueIndustries = new Set(suppliers.map(s => s.industry)).size;
      const supplierCount = suppliers.length;
      
      setStats({
        countries: uniqueCountries,
        suppliers: supplierCount,
        industries: uniqueIndustries
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to default values
      setStats({ countries: 50, suppliers: 1000, industries: 100 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-amber-50 relative overflow-hidden">
      {/* Yellow glow effect */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-300 rounded-full opacity-15 blur-3xl"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <Image 
              src="/Saurce Icon.png" 
              alt="Saurce Logo" 
              width={60} 
              height={60}
              className="object-contain"
            />
            <h1 className="text-5xl font-bold text-gray-900">Saurce</h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-7xl font-bold text-gray-900 mb-2 leading-tight">
            Sourcing in Africa
          </h2>
          <h3 className="text-7xl font-bold text-teal-600 mb-10 leading-tight">
            made Simple
          </h3>

          {/* Description */}
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with verified manufacturers and suppliers across Africa.
            Access detailed information on production capacity, pricing, and lead times.
          </p>

          {/* CTA Button */}
          <Link 
            href="/suppliers"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            Explore <ArrowRight size={20} />
          </Link>

          {/* Stats */}
          {loading ? (
            <div className="mt-24 mb-16 text-gray-500">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-3 gap-12 mt-24 mb-16">
              <div>
                <div className="text-6xl font-bold text-teal-600 mb-3">50+</div>
                <div className="text-gray-700 text-lg font-medium">Countries</div>
              </div>
              <div>
                <div className="text-6xl font-bold text-teal-600 mb-3">1000+</div>
                <div className="text-gray-700 text-lg font-medium">Verified Suppliers</div>
              </div>
              <div>
                <div className="text-6xl font-bold text-teal-600 mb-3">100+</div>
                <div className="text-gray-700 text-lg font-medium">Industries</div>
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="mt-20 text-gray-700">
            <p className="mb-3 text-lg">Questions? Reach out to us</p>
            <a 
              href="mailto:Info@saurce.com" 
              className="text-teal-600 font-semibold text-xl hover:text-teal-700 transition-colors"
            >
              Info@saurce.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}