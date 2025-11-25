// lib/services/supplierService.ts
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Supplier } from '@/types';

const SUPPLIERS_COLLECTION = 'suppliers';

export const supplierService = {
  // Get all suppliers
  async getAll(): Promise<Supplier[]> {
    const q = query(collection(db, SUPPLIERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Supplier[];
  },

  // Add new supplier
  async add(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, SUPPLIERS_COLLECTION), {
      ...supplier,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update supplier
  async update(id: string, supplier: Partial<Supplier>): Promise<void> {
    const docRef = doc(db, SUPPLIERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...supplier,
      updatedAt: Timestamp.now(),
    });
  },

  // Delete supplier
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, SUPPLIERS_COLLECTION, id));
  },

  // Get statistics
  async getStats(): Promise<{ countries: number; suppliers: number; industries: number }> {
    const suppliers = await this.getAll();
    const uniqueCountries = new Set(suppliers.map(s => s.country));
    const uniqueIndustries = new Set(suppliers.map(s => s.industry));
    
    return {
      countries: uniqueCountries.size,
      suppliers: suppliers.length,
      industries: uniqueIndustries.size,
    };
  }
};