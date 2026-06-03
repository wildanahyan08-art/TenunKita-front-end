'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        const role = data.data.user?.role;
        router.push(role === 'ADMIN' ? '/admin/profile' : '/');
      } else {
        setError(data.message || 'Email atau password salah');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0f08] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Batik pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L37.5 22.5L60 30L37.5 37.5L30 60L22.5 37.5L0 30L22.5 22.5Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-amber-700/20 rounded-tl-xl" />
      <div className="absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-amber-700/20 rounded-tr-xl" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-amber-700/20 rounded-bl-xl" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-amber-700/20 rounded-br-xl" />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gradient-to-br from-[#2a1a0e] to-[#1a0f08] rounded-3xl border border-amber-800/30 shadow-2xl shadow-black/40 p-8 md:p-10">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-2 group">
              <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-600/30 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500/70">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.3" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <span className="font-serif text-2xl text-white tracking-wide group-hover:text-amber-200 transition-colors">TenunKita</span>
            </Link>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/40 shrink-0">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-white mt-4">Selamat Datang Kembali</h2>
            <p className="text-amber-100/50 text-sm mt-2">
              Masuk untuk melanjutkan belanja Anda
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-amber-100/70 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder:text-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder:text-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/50 hover:text-amber-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/lupa-password" className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-amber-100/40">
              Belum punya akun?{' '}
              <Link href="/sign-up" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Daftar Sekarang
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-800/20">
            <div className="flex items-center justify-center gap-2 text-[10px] text-amber-600/50 tracking-[0.2em]">
              <div className="w-8 h-px bg-amber-800/30" />
              <span>MELESTARIKAN BUDAYA NUSANTARA</span>
              <div className="w-8 h-px bg-amber-800/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
