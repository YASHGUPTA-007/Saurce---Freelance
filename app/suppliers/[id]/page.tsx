// app/suppliers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supplierService } from '@/lib/services/supplierService';
import { Supplier } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';

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
      const found = suppliers.find(s => s.id === params.id);
      setSupplier(found || null);
    } catch (error) {
      console.error('Error loading supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!supplier) {
    return <div className="min-h-screen flex items-center justify-center">Supplier not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <Link href="/suppliers" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          Back to Suppliers
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Supplier Image */}
        <div className="bg-white rounded-lg overflow-hidden mb-6">
          <div className="aspect-video bg-gray-200">
            {supplier.photo && (
              <img 
                src={supplier.photo} 
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{supplier.name}</h1>
          <p className="text-gray-600 mb-6">{supplier.description}</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="font-semibold">Industry</span>
              </div>
              <p className="text-gray-900">{supplier.industry}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="font-semibold">Country</span>
              </div>
              <p className="text-gray-900">{supplier.country}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="font-semibold">Price Range</span>
              </div>
              <p className="text-gray-900">{supplier.priceRange}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="font-semibold">Lead Time</span>
              </div>
              <p className="text-gray-900">{supplier.leadTime}</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="font-semibold">Production Capacity</span>
              </div>
              <p className="text-gray-900">{supplier.productionCapacity}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-teal-600">Contact Person</div>
              <div className="font-semibold">{supplier.contactPerson}</div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-teal-600" size={20} />
              <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                {supplier.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-teal-600" size={20} />
              <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:underline">
                {supplier.phone}
              </a>
            </div>
            {supplier.website && (
              <div className="flex items-center gap-3">
                <Globe className="text-teal-600" size={20} />
                <a 
                  href={supplier.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {supplier.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Questions? Contact us</p>
          <a href="mailto:info@saurce.com" className="text-teal-600">info@saurce.com</a>
          <p className="mt-2">© 2025 Saurce. Sourcing in Africa made Simple.</p>
        </div>
      </div>
    </div>
  );
}