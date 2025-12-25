'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Search, 
  FileText, 
  Unlock, 
  MessageCircle, 
  Globe, 
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { analyticsService } from '@/lib/services/analyticsService';
import { statsService, HomeStats } from '@/lib/services/statsService';

export default function HomePage() {
  const [stats, setStats] = useState<HomeStats>({
    countries: 0,
    suppliers: 0,
    industries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      const visitTracked = sessionStorage.getItem('visitTracked');
      if (!visitTracked) {
        await analyticsService.incrementVisits();
        sessionStorage.setItem('visitTracked', 'true');
      }
    };

    const loadStats = async () => {
      try {
        const homeStats = await statsService.getHomeStats();
        setStats(homeStats);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-transparent">
        <div className="absolute top-1/4 right-0 w-64 h-64 md:w-96 md:h-96 md:right-1/4 md:top-1/3 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-56 h-56 md:w-80 md:h-80 md:left-1/3 bg-amber-300 rounded-full opacity-15 blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
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

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2 leading-tight px-4">
              Sourcing in Africa
            </h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-teal-600 mb-6 sm:mb-8 md:mb-10 leading-tight px-4">
              made Simple
            </h3>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Connect with verified manufacturers and suppliers across Africa. Access detailed information on production capacity, pricing, and lead times.
            </p>

            <Link 
              href="/suppliers"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Explore <ArrowRight size={20} />
            </Link>

          </div>
        </div>
      </div>

      {/* Why Choose Saurce Section */}
      <div className="bg-white py-20">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Why Choose Saurce
    </h2>

    <p className="text-gray-600 mb-12">
      Building trust in African manufacturing, one verification at a time.
    </p>

    <div className="relative flex items-center justify-center max-w-7xl mx-auto">
      <button className="hidden md:flex absolute -left-4 z-10 bg-gray-400 text-white p-2 rounded-full hover:bg-teal-600 transition-colors">
        <ChevronLeft size={20} />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[
          {
            title: "Personally Verified",
            desc: "Every manufacturer is researched and contacted by our team. No automated listings, no unverified data."
          },
          {
            title: "Africa-Focused Expertise",
            desc: "Deep coverage across Sub-Saharan Africa's key manufacturing hubs — Nigeria, Ghana, Kenya, and beyond."
          },
          {
            title: "Buyer-First Approach",
            desc: "Built by someone who struggled to source from Africa. We understand what you actually need: real contacts, real capacity, real pricing."
          },
          {
            title: "Transparent Information",
            desc: "Production capacity, MOQs, lead times, and contact details. Verified and updated regularly."
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-teal-50/30 p-8 rounded-xl border border-teal-100 min-h-[180px] flex flex-col justify-center shadow-sm"
          >
            <h3 className="font-bold text-teal-900 mb-4 text-lg">
              {item.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <button className="hidden md:flex absolute -right-4 z-10 bg-gray-400 text-white p-2 rounded-full hover:bg-teal-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
</div>


      {/* How It Works Section */}
      <div className="bg-slate-50 py-24 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">A simple process for discovering African manufacturers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Buyers Column */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 flex flex-col h-full border border-teal-100 shadow-sm">
              <h3 className="text-teal-600 font-bold text-xl mb-10">For Buyers</h3>
              <div className="space-y-10 flex-grow text-left">
                {[
                  { t: "1. Search Our Directory", d: "Browse verified manufacturers across Sub-Saharan Africa. Filter by industry, country, and production capacity." },
                  { t: "2. View Detailed Profiles", d: "Access comprehensive information: production capabilities, certifications, typical lead times, and contact details." },
                  { t: "3. Unlock Contact Information", d: "Share your details to access direct manufacturer contacts. Connect via email or phone." },
                  { t: "4. Connect Directly", d: "Reach out to manufacturers yourself. Negotiate, request samples, and build your relationship." }
                ].map((step, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-gray-900 mb-2 text-base">{step.t}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.d}</p>
                  </div>
                ))}
              </div>
              {/* Functional Link Redirecting to /suppliers */}
              <Link 
                href="/suppliers" 
                className="mt-12 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-full transition-all shadow-lg flex items-center justify-center"
              >
                Start Searching
              </Link>
            </div>

            {/* For Suppliers Column */}
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 flex flex-col h-full border border-teal-100 shadow-sm">
              <h3 className="text-teal-600 font-bold text-xl mb-10">For Suppliers</h3>
              <div className="flex-grow flex flex-col justify-center text-left">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Coming Soon: List Your Manufacturing Business</h4>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  We&apos;re building Africa&apos;s most trusted manufacturer directory. If you&apos;re an export-ready manufacturer in Sub-Saharan Africa, we want to feature you.
                </p>
              </div>
              <div className="mt-12 w-full bg-teal-600/50 text-white font-bold py-4 rounded-full flex items-center justify-center cursor-default">
                Get Featured
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="mb-4 text-base sm:text-lg text-gray-700 font-medium">Questions? Reach out to us</p>
          <a 
            href="mailto:Info@saurce.com" 
            className="text-teal-600 font-bold text-2xl sm:text-3xl hover:text-teal-700 transition-colors break-all underline underline-offset-8 decoration-teal-100"
          >
            Info@saurce.com
          </a>
        </div>
      </div>
    </div>
  );
}