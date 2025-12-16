'use client';

import { useState, useEffect } from "react";
import { supplierService } from "@/lib/services/supplierService";
import { Supplier } from "@/types";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Package,
  DollarSign,
  Clock,
  Building2,
  User,
  Lock,
  X,
  Loader2
} from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";

// Firebase Imports
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SupplierDetailPage() {
  const params = useParams();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verification States
  const [isVerified, setIsVerified] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    loadSupplier();
    checkVerificationStatus();
  }, [params.id]);

  const checkVerificationStatus = () => {
    // Check for "saurce_verified_lead" cookie
    const hasVerification = document.cookie
      .split('; ')
      .find(row => row.startsWith('saurce_verified_lead='));
    
    if (hasVerification) {
      setIsVerified(true);
    }
  };

  const loadSupplier = async () => {
    try {
      const suppliers = await supplierService.getAll();
      const found = suppliers.find((s) => s.id === params.id);
      setSupplier(found || null);
    } catch (error) {
      console.error("Error loading supplier:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Supplier not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/suppliers"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Suppliers</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Image
                src="/Saurce Icon.png"
                alt="Saurce Logo"
                width={36}
                height={36}
                className="object-contain sm:w-11 sm:h-11"
              />
            </div>
            <span className="font-semibold text-gray-900">Saurce</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Supplier Image */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="aspect-video bg-gray-200 relative">
            {supplier.photo ? (
              <img
                src={supplier.photo}
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
                <Building2 size={80} className="text-teal-200" />
              </div>
            )}
          </div>
        </div>

        {/* Supplier Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {supplier.name}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            {supplier.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Industry */}
            <div className="flex items-start gap-3">
              <Building2
                className="text-teal-600 mt-1 flex-shrink-0"
                size={20}
              />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Industry
                </div>
                <p className="text-gray-900 font-medium">{supplier.industry || "N/A"}</p>
              </div>
            </div>

            {/* Country */}
            <div className="flex items-start gap-3">
              <MapPin className="text-teal-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Country
                </div>
                <p className="text-gray-900 font-medium">{supplier.country || "N/A"}</p>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex items-start gap-3">
              <DollarSign
                className="text-teal-600 mt-1 flex-shrink-0"
                size={20}
              />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Price Range
                </div>
                <p className="text-gray-900 font-medium">
                  {supplier.priceRange || "N/A"}
                </p>
              </div>
            </div>

            {/* Lead Time */}
            <div className="flex items-start gap-3">
              <Clock className="text-teal-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Lead Time
                </div>
                <p className="text-gray-900 font-medium">{supplier.leadTime || "N/A"}</p>
              </div>
            </div>

            {/* Production Capacity */}
            <div className="flex items-start gap-3 sm:col-span-2">
              <Package className="text-teal-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Production Capacity
                </div>
                <p className="text-gray-900 font-medium">
                  {supplier.productionCapacity || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card - With Masking Logic */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-12 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>

          {!isVerified && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 text-center max-w-sm mx-4">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-teal-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Details Locked</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Unlock to view direct contact information, phone number, and email.
                </p>
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="w-full bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Unlock Contact Details
                </button>
              </div>
            </div>
          )}

          <div className={!isVerified ? "filter blur-sm select-none pointer-events-none opacity-50" : ""}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Contact Person */}
              <div className="flex items-start gap-3">
                <User className="text-teal-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    Contact Person
                  </div>
                  <p className="text-gray-900 font-medium">
                    {supplier.contactPerson || "Protected"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="text-teal-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-teal-600 hover:text-teal-700 font-medium hover:underline break-all"
                  >
                    {supplier.email || "Protected@email.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="text-teal-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    Phone
                  </div>
                  <a
                    href={`tel:${supplier.phone}`}
                    className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                  >
                    {supplier.phone || "+00 000 000 000"}
                  </a>
                </div>
              </div>

              {/* Website */}
              {supplier.website && (
                <div className="flex items-start gap-3">
                  <Globe className="text-teal-600 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-semibold text-gray-500 mb-1">
                      Website
                    </div>
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 font-medium hover:underline break-all"
                    >
                      {supplier.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Questions? Contact us</p>
          <a
            href="mailto:info@saurce.com"
            className="text-teal-600 hover:text-teal-700 font-semibold text-sm hover:underline"
          >
            info@saurce.com
          </a>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 Saurce. Sourcing in Africa made Simple.
          </p>
        </div>
      </div>

      {/* Unlock Modal */}
      {showUnlockModal && supplier && (
        <LeadVerificationModal 
          supplierId={supplier.id}
          supplierName={supplier.name}
          onClose={() => setShowUnlockModal(false)}
          onVerified={() => {
            setIsVerified(true);
            setShowUnlockModal(false);
          }}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Modal Component with Firebase Saving Logic
// ------------------------------------------------------------------
function LeadVerificationModal({ 
  supplierId,
  supplierName,
  onClose, 
  onVerified 
}: { 
  supplierId: string;
  supplierName: string;
  onClose: () => void; 
  onVerified: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.consent) {
      setError('Please fill in all fields and accept the privacy policy.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Save Lead to Firebase Firestore
      await addDoc(collection(db, "leads"), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        supplierId: supplierId,
        supplierName: supplierName,
        verifiedAt: serverTimestamp(),
        status: 'verified' // You can use this for future admin filtering
      });

      // 2. Set Cookie to remember verification (90 days)
      const days = 90;
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `saurce_verified_lead=true; expires=${date.toUTCString()}; path=/`;

      // 3. Unlock UI
      onVerified();

    } catch (err) {
      console.error("Error saving lead:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Unlock Details</h2>
            <p className="text-sm text-gray-600 mt-2">
              Please provide your details to verify you are a real buyer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="flex items-start gap-2 mt-4">
              <input 
                type="checkbox" 
                id="consent"
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                checked={formData.consent}
                onChange={(e) => setFormData({...formData, consent: e.target.checked})}
              />
              <label htmlFor="consent" className="text-xs text-gray-600">
                I agree to share my details with Saurce and agree to the <a href="#" className="text-teal-600 underline">Privacy Policy</a>. I understand I may be contacted for verification.
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                'Verify & Unlock'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}