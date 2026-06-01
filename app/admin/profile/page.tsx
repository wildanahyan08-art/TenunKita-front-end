'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Smartphone,
  CheckCircle,
  Package,
  ShoppingBag,
  Users,
  Star,
} from 'lucide-react';

interface Admin {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  address?: string;
  createdAt?: string;
  user?: { username: string; role: string };
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-amber-50/50 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">{label}</p>
        <p className="text-sm font-semibold text-[#1a120b] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="bg-white rounded-xl border border-amber-200/40 p-5 hover:shadow-sm transition-all group">
      <div className={`w-10 h-10 ${accent} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#1a120b] group-hover:text-amber-700 transition-colors">{value}</p>
      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.12em] mt-1">{label}</p>
    </div>
  );
}

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { setIsLoading(false); return; }

    const parsed = JSON.parse(userData);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    fetch(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((result) => { setAdmin(result.data || result); setIsLoading(false); })
      .catch(() => {
        setAdmin({
          name: parsed.name,
          email: parsed.email,
          role: parsed.role,
          phone: parsed.phone || '',
          address: parsed.address,
          createdAt: parsed.createdAt,
          user: { username: parsed.email, role: parsed.role },
        });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-amber-800 font-serif">Memuat data admin...</p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ─── HEADER ─── */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Profil Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Informasi dan pengaturan akun administrator</p>
      </div>

      {/* ─── PROFILE CARD ─── */}
      <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
        <div className="px-6 pb-6 -mt-14 relative z-10">
          <div className="flex items-end gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 border-[3px] border-white shadow-xl flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
              <span className="text-3xl font-bold text-white">
                {admin.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="pb-1 min-w-0">
              <h2 className="text-xl font-serif font-bold text-[#1a120b]">{admin.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded-md tracking-wider">ADMIN</span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Package className="w-4.5 h-4.5 text-white" />} label="Produk" value="—" accent="bg-amber-600" />
        <StatCard icon={<ShoppingBag className="w-4.5 h-4.5 text-white" />} label="Pesanan" value="—" accent="bg-amber-700" />
        <StatCard icon={<Users className="w-4.5 h-4.5 text-white" />} label="Pengguna" value="—" accent="bg-amber-800" />
        <StatCard icon={<Star className="w-4.5 h-4.5 text-white" />} label="Rating" value="—" accent="bg-amber-600" />
      </div>

      {/* ─── ADMIN DATA ─── */}
      <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-100 flex items-center gap-3">
          <User className="w-4 h-4 text-amber-600" />
          <h3 className="font-serif font-bold text-[#1a120b] text-base">Data Admin</h3>
        </div>
        <div className="divide-y divide-amber-50">
          <InfoRow icon={<User className="w-4 h-4" />} label="Nama Pengguna" value={admin.user?.username || admin.email || '-'} />
          <InfoRow icon={<Shield className="w-4 h-4" />} label="Peran" value={admin.user?.role || admin.role || '-'} />
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={admin.email || '-'} />
          <InfoRow icon={<Smartphone className="w-4 h-4" />} label="Nomor Telepon" value={admin.phone || '-'} />
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Bergabung" value={admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
          <InfoRow icon={<CheckCircle className="w-4 h-4 text-emerald-600" />} label="Status Akun" value="Aktif" />
        </div>
      </div>

      {/* ─── INFO ─── */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-2xl p-5 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative flex items-center gap-4">
          <Shield className="w-8 h-8 text-amber-300/60 shrink-0" />
          <div>
            <p className="text-white font-serif font-semibold text-sm">Panel Administrasi TenunKita</p>
            <p className="text-amber-200/60 text-xs mt-0.5">Gunakan sidebar untuk mengelola data produk, kategori, pelanggan, dan pesanan.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
