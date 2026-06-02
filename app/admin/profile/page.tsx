'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Pencil,
  Save,
  X,
  LogOut,
  ShoppingBag,
  Package,
  Users,
  Star,
  ChevronRight,
  Copy,
  Check,
  Shield,
  FolderTree,
  CreditCard,
} from 'lucide-react';
import { api } from '@/lib/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function AdminProfilePage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [avgRating, setAvgRating] = useState<string>('—');
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      setAdmin(parsed);
      setEditForm({ name: parsed.name || '', email: parsed.email || '', address: parsed.address || '' });
    } catch {
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    Promise.all([
      fetch(`${API_URL}/products`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([productsRes, ordersRes, usersRes]) => {
      const products = Array.isArray(productsRes) ? productsRes : (productsRes.data || []);
      const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.data || []);
      const users = Array.isArray(usersRes) ? usersRes : (usersRes.data || []);

      setProductCount(products.length);
      setOrderCount(orders.length);
      setUserCount(users.filter((u: { role: string }) => u.role === 'BUYER').length);

      if (products.length > 0) {
        const totalRating = products.reduce(
          (sum: number, p: { averageRating: number }) => sum + (p.averageRating || 0),
          0
        );
        setAvgRating((totalRating / products.length).toFixed(1));
      }

      setStatsLoading(false);
    }).catch(() => {
      setStatsLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCopyEmail = () => {
    if (admin?.email) {
      navigator.clipboard.writeText(admin.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !admin) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await api.updateProfile(token, { name: editForm.name, email: editForm.email, address: editForm.address });
      const updated = { ...admin, name: editForm.name, email: editForm.email, address: editForm.address };
      setAdmin(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setSaveMessage('Profil berhasil diperbarui!');
      setIsEditing(false);
    } catch {
      setSaveMessage('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memuat profil admin...</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const memberSince = formatDate(admin.createdAt);

  return (
    <div className="max-w-6xl mx-auto">
      {/* ─── SAVE MESSAGE ─── */}
      {saveMessage && (
        <div className={`mb-5 px-5 py-3 rounded-xl border text-sm font-medium flex items-center gap-3 ${
          saveMessage.includes('berhasil')
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {saveMessage.includes('berhasil') ? (
            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-5 h-5 text-red-500 shrink-0" />
          )}
          {saveMessage}
        </div>
      )}

      {/* ─── PROFILE BANNER ─── */}
      <section className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 -rotate-12 translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-28 h-28 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <span className="text-4xl font-serif font-bold text-white">{admin.name?.charAt(0)?.toUpperCase() || 'A'}</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{admin.name}</h2>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-amber-600/40 text-amber-200 text-[10px] font-bold uppercase tracking-widest border border-amber-400/30">
              <Shield className="w-3 h-3 mr-1" />
              Administrator
            </span>
          </div>
          <p className="text-amber-200/70 text-sm max-w-lg italic">
            &ldquo;Menjaga dan mengelola warisan budaya Nusantara melalui platform TenunKita.&rdquo;
          </p>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit Profil
          </button>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1a120b] group-hover:text-amber-700 transition-colors">
              {statsLoading ? (
                <span className="inline-block w-8 h-5 bg-amber-100 rounded animate-pulse" />
              ) : productCount}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.12em] mt-1">Produk</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-amber-700 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1a120b] group-hover:text-amber-700 transition-colors">
              {statsLoading ? (
                <span className="inline-block w-8 h-5 bg-amber-100 rounded animate-pulse" />
              ) : orderCount}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.12em] mt-1">Pesanan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1a120b] group-hover:text-amber-700 transition-colors">
              {statsLoading ? (
                <span className="inline-block w-8 h-5 bg-amber-100 rounded animate-pulse" />
              ) : userCount}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.12em] mt-1">Pengguna</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#1a120b] group-hover:text-amber-700 transition-colors">
              {statsLoading ? (
                <span className="inline-block w-8 h-5 bg-amber-100 rounded animate-pulse" />
              ) : avgRating}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.12em] mt-1">Rating</p>
          </div>
        </div>
      </div>

      {/* ─── DASHBOARD GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-8 space-y-6">

          {/* ─── DATA ADMIN ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-[#1a120b] text-base">Data Admin</h3>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: admin.name, email: admin.email, address: admin.address });
                    }}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Batal
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {isEditing ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-[#1a120b] bg-amber-50/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-[#1a120b] bg-amber-50/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Alamat
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-[#1a120b] bg-amber-50/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm resize-none"
                      placeholder="Alamat lengkap"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white font-medium rounded-xl transition-all shadow-md text-sm"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nama Lengkap</label>
                    <p className="text-sm font-medium text-[#1a120b]">{admin.name}</p>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#1a120b]">{admin.email}</p>
                      <button onClick={handleCopyEmail} className="text-amber-500 hover:text-amber-600 transition-colors shrink-0" title="Salin email">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Peran</label>
                    <p className="text-sm font-medium text-[#1a120b]">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded tracking-wider">ADMIN</span>
                    </p>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Alamat</label>
                    <p className="text-sm font-medium text-[#1a120b]">{admin.address || <span className="text-gray-400 italic">Belum diisi</span>}</p>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Bergabung Sejak</label>
                    <p className="text-sm font-medium text-[#1a120b]">{memberSince}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="lg:col-span-4 space-y-6">

          {/* ─── MENU ADMIN ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100">
              <h3 className="font-serif font-bold text-[#1a120b] text-base">Menu Admin</h3>
            </div>
            <div className="p-3">
              {[
                { icon: User, label: 'Profil', href: '/admin/profile', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: Package, label: 'Produk', href: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: FolderTree, label: 'Kategori', href: '/admin/categories', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Users, label: 'Pelanggan', href: '/admin/customers', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: ShoppingBag, label: 'Pesanan', href: '/admin/orders', color: 'text-orange-600', bg: 'bg-orange-50' },
                { icon: CreditCard, label: 'Pembayaran', href: '/admin/payments', color: 'text-rose-600', bg: 'bg-rose-50' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50/70 transition-all group"
                >
                  <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-[#1a120b] group-hover:text-amber-700 transition-colors flex-1">
                    {item.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* ─── INFO PANEL ─── */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 shadow-xl">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] text-amber-300/70 uppercase tracking-[0.2em] font-bold">Panel Admin</span>
                <Shield className="w-5 h-5 text-amber-300/60" />
              </div>
              <div className="space-y-3">
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  Selamat datang di panel administrasi TenunKita. Gunakan menu di samping untuk mengelola data produk, kategori, pelanggan, pesanan, dan pembayaran.
                </p>
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-[10px] text-amber-300/50">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Sistem aktif
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── LOGOUT ─── */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>

        </div>
      </div>
    </div>
  );
}
