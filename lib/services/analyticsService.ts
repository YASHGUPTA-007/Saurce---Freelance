// lib/services/analyticsService.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment, runTransaction } from 'firebase/firestore';

const ANALYTICS_DOC_ID = 'siteAnalytics';

export const analyticsService = {
  // Increment visit count
  async incrementVisits(): Promise<void> {
    const analyticsRef = doc(db, 'analytics', ANALYTICS_DOC_ID);
    
    try {
      await runTransaction(db, async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsRef);
        
        if (!analyticsDoc.exists()) {
          transaction.set(analyticsRef, {
            totalVisits: 1,
            lastUpdated: new Date().toISOString()
          });
        } else {
          transaction.update(analyticsRef, {
            totalVisits: increment(1),
            lastUpdated: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error incrementing visits:', error);
    }
  },

  // Get total visits
  async getTotalVisits(): Promise<number> {
    try {
      const analyticsRef = doc(db, 'analytics', ANALYTICS_DOC_ID);
      const analyticsDoc = await getDoc(analyticsRef);
      
      if (analyticsDoc.exists()) {
        return analyticsDoc.data().totalVisits || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching visits:', error);
      return 0;
    }
  }
};