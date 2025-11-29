// app/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { analyticsService } from '@/lib/services/analyticsService';

export default function HomePage() {
  useEffect(() => {
    // Track visit when page loads
    const trackVisit = async () => {
      // Check if visit was already tracked in this session
      const visitTracked = sessionStorage.getItem('visitTracked');
      
      if (!visitTracked) {
        await analyticsService.incrementVisits();
        sessionStorage.setItem('visitTracked', 'true');
      }
    };

    trackVisit();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-amber-50 relative overflow-hidden">
      {/* Yellow glow effect - adjusted for mobile */}
      <div className="absolute top-1/4 right-0 w-64 h-64 md:w-96 md:h-96 md:right-1/4 md:top-1/3 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-56 h-56 md:w-80 md:h-80 md:left-1/3 bg-amber-300 rounded-full opacity-15 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <Image 
              src="/Saurce Icon.png" 
              alt="Saurce Logo" 
              width={48} 
              height={48}
              className="object-contain sm:w-[60px] sm:h-[60px]"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Saurce</h1>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight px-4">
            Sourcing in Africa
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-600 mb-6 sm:mb-8 md:mb-10 leading-tight px-4">
            made Simple
          </h3>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Connect with verified manufacturers and suppliers across Africa. Access detailed information on production capacity, pricing, and lead times.
          </p>

          {/* CTA Button */}
          <Link 
            href="/suppliers"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            Explore <ArrowRight size={20} />
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 mt-16 sm:mt-20 md:mt-24 mb-12 sm:mb-14 md:mb-16 px-4">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-2 sm:mb-3">50+</div>
              <div className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg font-medium">Countries</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-2 sm:mb-3">1000+</div>
              <div className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg font-medium">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-2 sm:mb-3">100+</div>
              <div className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg font-medium">Industries</div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 sm:mt-20 text-gray-700 px-4">
            <p className="mb-2 sm:mb-3 text-base sm:text-lg">Questions? Reach out to us</p>
            <a 
              href="mailto:Info@saurce.com" 
              className="text-teal-600 font-semibold text-lg sm:text-xl hover:text-teal-700 transition-colors break-all"
            >
              Info@saurce.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}