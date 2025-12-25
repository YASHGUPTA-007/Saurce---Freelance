// lib/services/statsService.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HomeStats {
  countries: number;
  suppliers: number;
  industries: number;
}

class StatsService {
  /**
   * Get dynamic statistics for the home page
   */
  async getHomeStats(): Promise<HomeStats> {
    try {
      const suppliersRef = collection(db, 'suppliers');
      const snapshot = await getDocs(suppliersRef);
      
      const uniqueCountries = new Set<string>();
      const uniqueIndustries = new Set<string>();
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Count unique countries
        if (data.country && data.country.trim()) {
          uniqueCountries.add(data.country.trim().toLowerCase());
        }
        
        // Count unique industries
        if (data.industry && data.industry.trim()) {
          uniqueIndustries.add(data.industry.trim().toLowerCase());
        }
      });
      
      return {
        countries: uniqueCountries.size,
        suppliers: snapshot.size,
        industries: uniqueIndustries.size
      };
    } catch (error) {
      console.error('Error fetching home stats:', error);
      // Return fallback values if there's an error
      return {
        countries: 0,
        suppliers: 0,
        industries: 0
      };
    }
  }
}

export const statsService = new StatsService();