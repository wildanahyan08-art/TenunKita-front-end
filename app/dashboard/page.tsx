// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  Package, 
  Heart, 
  User, 
  LogOut,
  Calendar,
  MapPin,
  Mail,
  TrendingUp,
  Star
} from 'lucide-react';

// Komponen ornamen batik
const BatikBorder = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-600/60 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
    </svg>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
  </div>
);

const SectionHeading = ({ label, title }: { label: string; title: string }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-3">
      <div className="w-12 h-px bg-amber-600/40" />
      <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">{label}</span>
      <div className="w-12 h-px bg-amber-600/40" />
    </div>
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b]">{title}</h2>
    <BatikBorder />
  </div>
);

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role === 'ADMIN') {
        router.push('/admin/profile');
        return;
      }
      router.push('/');
      return;
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/sign-in');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-800 font-serif">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf6f0]">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-800/80" />
          <div className="relative z-10 p-8 md:p-10 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-300 text-sm">✦</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-amber-200/80">Selamat Datang</span>
              <span className="text-amber-300 text-sm">✦</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
              {user.name}!
            </h1>
            <p className="text-amber-100/80 text-sm max-w-md">
              Senang melihat Anda kembali di TenunKita. Terus dukung warisan budaya Nusantara!
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Total Pesanan', value: '0', icon: '🛍️', desc: 'Belum ada pesanan', bg: 'bg-white' },
            { label: 'Total Belanja', value: 'Rp 0', icon: '💰', desc: 'Mulai belanja yuk!', bg: 'bg-white' },
            { label: 'Poin Reward', value: '0', icon: '⭐', desc: 'Belum ada poin', bg: 'bg-white' },
            { label: 'Member Sejak', value: formatDate(user.createdAt).split(' ')[0], icon: '📅', desc: formatDate(user.createdAt), bg: 'bg-gradient-to-r from-amber-50 to-amber-100/30' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-5 border border-amber-100 hover:shadow-lg transition-all duration-300 group`}>
              <div className="text-3xl mb-3">{stat.icon}</div>
              <h3 className="text-2xl font-serif font-bold text-[#1a120b]">{stat.value}</h3>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              <p className="text-gray-400 text-xs mt-2">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* User Profile Info Section */}
        <SectionHeading label="Informasi Akun" title="Profil Saya" />
        
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden max-w-3xl mx-auto mb-12">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-amber-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1a120b]">{user.name}</h3>
                <p className="text-amber-600 text-sm">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Alamat Email</p>
                  <p className="text-[#1a120b] font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Alamat</p>
                  <p className="text-[#1a120b] font-medium">{user.address || 'Belum diisi'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Bergabung Sejak</p>
                  <p className="text-[#1a120b] font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-100">
              <Link 
                href="/dashboard/profile" 
                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-600 text-sm font-medium"
              >
                Edit Profil <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <SectionHeading label="Aksi Cepat" title="Yang Ingin Kamu Lakukan?" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
          {[
            { icon: '🛍️', title: 'Belanja', desc: 'Temukan produk baru', href: '/produk', color: 'bg-amber-50 hover:bg-amber-100' },
            { icon: '📦', title: 'Pesanan', desc: 'Lacak pesanan kamu', href: '/dashboard/orders', color: 'bg-orange-50 hover:bg-orange-100' },
            { icon: '❤️', title: 'Favorit', desc: 'Produk yang disimpan', href: '/dashboard/wishlist', color: 'bg-red-50 hover:bg-red-100' },
            { icon: '👤', title: 'Profil', desc: 'Update informasi', href: '/dashboard/profile', color: 'bg-blue-50 hover:bg-blue-100' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={`${item.color} rounded-xl p-5 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-serif font-semibold text-[#1a120b] text-sm">{item.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Rekomendasi Produk */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-px bg-amber-600/40" />
                <span className="text-amber-700 text-[10px] font-bold tracking-[0.25em] uppercase">Rekomendasi</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1a120b]">Produk yang Mungkin Kamu Suka</h3>
            </div>
            <Link href="/produk" className="text-amber-600 text-sm hover:text-amber-700 flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-amber-100 overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-48 bg-gradient-to-br from-amber-50 to-amber-100/50 flex items-center justify-center">
                  <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform">🎨</span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-semibold text-[#1a120b]">Contoh Produk {i}</h4>
                  <p className="text-amber-700 font-bold mt-1">Rp XXX.XXX</p>
                  <button className="w-full mt-3 bg-amber-50 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Motif */}
        <div className="mt-12 pt-6 text-center">
          <div className="flex items-center justify-center gap-2 opacity-40">
            <div className="w-16 h-px bg-amber-600" />
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" className="text-amber-600"/>
            </svg>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="rotate-45">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" className="text-amber-600"/>
            </svg>
            <div className="w-16 h-px bg-amber-600" />
          </div>
          <p className="text-[9px] text-gray-400 mt-3 tracking-[0.2em] uppercase">
            Melestarikan Warisan Budaya Nusantara
          </p>
        </div>

      </div>
    </div>
  );
}