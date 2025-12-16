// types/index.ts
export interface Supplier {
  id: string;
  name: string;
  description: string;
  industry: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  productionCapacity: string;
  priceRange: string;
  leadTime: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  countries: number;
  suppliers: number;
  industries: number;
}


export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  supplierId: string;
  supplierName: string;
  verifiedAt: any; // Firestore Timestamp
  status: 'verified' | 'pending';
}