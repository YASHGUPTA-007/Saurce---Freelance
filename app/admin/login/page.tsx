// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Lock } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-lg">
        <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 font-medium">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image 
            src="/Saurce Icon.png" 
            alt="Saurce Logo" 
            width={48} 
            height={48}
            className="object-contain"
          />
          <h1 className="text-3xl font-bold text-gray-900">Saurce</h1>
        </div>

        <h2 className="text-3xl font-bold mb-3 text-gray-900">Admin Login</h2>
        <p className="text-gray-600 mb-8 text-lg">Access the supplier management panel</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-3">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-900 font-semibold mb-3">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}