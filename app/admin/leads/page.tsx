'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { leadService } from '@/lib/services/leadService';
import { Lead } from '@/types';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Loader2, 
  ChevronRight, 
  Trash2, 
  Search, 
  X,
  RefreshCw,
  Building2,
  Calendar
} from 'lucide-react';

export default function AdminLeadsPage() {
  const router = useRouter();
  
  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination State
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Deletion State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initData();
      } else {
        router.push('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load Initial Data (Paginated)
  const initData = async () => {
    setLoading(true);
    try {
      const [data, count] = await Promise.all([
        leadService.getFirstPage(),
        leadService.getTotalCount()
      ]);
      
      setLeads(data.leads);
      setLastDoc(data.lastVisible);
      setTotalCount(count);
    } catch (error) {
      console.error("Error loading leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Pagination Next
  const handleNext = async () => {
    if (!lastDoc) return;
    setIsNextPageLoading(true);
    try {
      const data = await leadService.getNextPage(lastDoc);
      if (data.leads.length > 0) {
        setLeads(data.leads);
        setLastDoc(data.lastVisible);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching next page", error);
    } finally {
      setIsNextPageLoading(false);
    }
  };

  // Handle Reset / Clear Search
  const handleReset = () => {
    setSearchTerm('');
    setPage(1);
    setLastDoc(null);
    initData();
  };

  // Handle Search Submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) {
      handleReset();
      return;
    }

    setIsSearching(true);
    setPage(1); // Reset page count for search view
    setLastDoc(null); // Disable standard pagination during search

    try {
      const results = await leadService.searchLeads(searchTerm);
      setLeads(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      await leadService.deleteLead(id);
      // Remove from local state
      setLeads(prev => prev.filter(lead => lead.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Supplier Interested", "Date Verified"];
    const rows = leads.map(l => [
      l.name,
      l.email,
      l.phone,
      l.supplierName,
      l.verifiedAt ? new Date(l.verifiedAt.seconds * 1000).toLocaleDateString() : 'N/A'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !isSearching && leads.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader2 className="animate-spin text-teal-600" size={32} />
        <p className="text-gray-500">Loading Leads...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-2 transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Captured Leads</h1>
              <p className="text-sm text-gray-500 mt-1">
                Total Verified Leads: <span className="font-semibold text-teal-600">{totalCount}</span>
              </p>
            </div>
            
            <button 
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition-all"
            >
              <Download size={18} />
              Export Page
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-3 items-center">
             <form onSubmit={handleSearch} className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search by name (case sensitive)..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
               />
               {searchTerm && (
                 <button 
                   type="button"
                   onClick={() => setSearchTerm('')}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                 >
                   <X size={16} />
                 </button>
               )}
             </form>
             <div className="flex gap-2 w-full sm:w-auto">
               <button 
                 onClick={() => handleSearch()}
                 disabled={isSearching}
                 className="flex-1 sm:flex-none px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
               >
                 {isSearching ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
               </button>
               {(searchTerm || leads.length < totalCount) && !lastDoc && (
                 <button 
                   onClick={handleReset}
                   className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                   title="Reset View"
                 >
                   <RefreshCw size={18} />
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Lead Details</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Contact Info</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Interested In</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <a href={`mailto:${lead.email}`} className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                          {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="text-gray-500 text-xs">
                          {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} className="text-gray-400" />
                        <span className="font-medium">{lead.supplierName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {lead.verifiedAt 
                          ? new Date(lead.verifiedAt.seconds * 1000).toLocaleDateString() 
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        disabled={deletingId === lead.id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Lead"
                      >
                        {deletingId === lead.id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                           <Search size={24} />
                         </div>
                         <p className="text-lg font-medium text-gray-900">No leads found</p>
                         <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                         {searchTerm && (
                           <button onClick={handleReset} className="mt-4 text-teal-600 font-medium hover:underline">
                             Clear Search
                           </button>
                         )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer - Hide if searching */}
          {!searchTerm && leads.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500">
                Page <span className="font-medium">{page}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First Page
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!lastDoc || isNextPageLoading}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isNextPageLoading ? <Loader2 className="animate-spin" size={14} /> : null}
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}