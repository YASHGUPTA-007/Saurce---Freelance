import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  where,
  deleteDoc,
  doc,
  getCountFromServer,
  DocumentData,
  QueryDocumentSnapshot 
} from 'firebase/firestore';
import { Lead } from '@/types';

const PAGE_SIZE = 10;

export const leadService = {
  // --- PAGINATION METHODS ---

  getFirstPage: async () => {
    const leadsRef = collection(db, 'leads');
    // Order by date descending
    const q = query(leadsRef, orderBy('verifiedAt', 'desc'), limit(PAGE_SIZE));
    
    const snapshot = await getDocs(q);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];

    return { leads, lastVisible };
  },

  getNextPage: async (lastVisible: QueryDocumentSnapshot<DocumentData>) => {
    const leadsRef = collection(db, 'leads');
    const q = query(
      leadsRef, 
      orderBy('verifiedAt', 'desc'), 
      startAfter(lastVisible), 
      limit(PAGE_SIZE)
    );
    
    const snapshot = await getDocs(q);
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    const leads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];

    return { leads, lastVisible: newLastVisible };
  },

  getTotalCount: async () => {
    const coll = collection(db, 'leads');
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  },

  // --- NEW METHODS ---

  // Search by Name or Email (Exact or Prefix match)
  // Note: Firestore is case-sensitive. For better search, save a lowercase version of the name in DB.
  searchLeads: async (term: string) => {
    const leadsRef = collection(db, 'leads');
    
    // We'll search by name. 
    // \uf8ff is a high unicode character that allows "starts with" query
    const q = query(
      leadsRef, 
      where('name', '>=', term),
      where('name', '<=', term + '\uf8ff'),
      limit(20) // Limit search results
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
  },

  deleteLead: async (id: string) => {
    const docRef = doc(db, 'leads', id);
    await deleteDoc(docRef);
  }
};