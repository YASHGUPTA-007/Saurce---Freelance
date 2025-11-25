"use client";

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
} from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function SupplierDetailPage() {
  const params = useParams();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, [params.id]);

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
            {supplier.description}
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
                <p className="text-gray-900 font-medium">{supplier.industry}</p>
              </div>
            </div>

            {/* Country */}
            <div className="flex items-start gap-3">
              <MapPin className="text-teal-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <div className="text-sm font-semibold text-teal-600 mb-1">
                  Country
                </div>
                <p className="text-gray-900 font-medium">{supplier.country}</p>
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
                  {supplier.priceRange}
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
                <p className="text-gray-900 font-medium">{supplier.leadTime}</p>
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
                  {supplier.productionCapacity}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Contact Person */}
            <div className="flex items-start gap-3">
              <User className="text-teal-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Contact Person
                </div>
                <p className="text-gray-900 font-medium">
                  {supplier.contactPerson}
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
                  {supplier.email}
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
                  {supplier.phone}
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
    </div>
  );
}
