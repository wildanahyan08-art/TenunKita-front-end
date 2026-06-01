'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  MapPin,
  Pencil,
  Save,
  X,
  LogOut,
  ShoppingBag,
  Package,
  Heart,
  Star,
  ChevronRight,
  Clock,
  Copy,
  Check,
  Gift,
  Award,
  LayoutDashboard,
} from 'lucide-react';

interface CustomerUser {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsed);
      setEditForm({ name: parsed.name || '', address: parsed.address || '' });
    } catch {
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const updatedUser = { ...user, name: editForm.name, address: editForm.address };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSaveMessage('Profil berhasil diperbarui!');
        setIsEditing(false);
      } else {
        setSaveMessage(result.message || 'Gagal memperbarui profil');
      }
    } catch {
      setSaveMessage('Terjadi kesalahan. Silakan coba lagi.');
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
          <p className="text-amber-800 font-serif text-lg">Memuat profil Anda...</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const memberSince = formatDate(user.createdAt);

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
            <span className="text-4xl font-serif font-bold text-white">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">{user.name}</h2>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-amber-600/40 text-amber-200 text-[10px] font-bold uppercase tracking-widest border border-amber-400/30">
              <Heart className="w-3 h-3 mr-1" />
              Heritage Member
            </span>
          </div>
          <p className="text-amber-200/70 text-sm max-w-lg italic">
            &ldquo;Mendedikasikan diri untuk merawat dan mengapresiasi setiap helai benang identitas bangsa melalui TenunKita.&rdquo;
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

      {/* ─── DASHBOARD GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ─── LEFT COLUMN ─── */}
        <div className="lg:col-span-8 space-y-6">

          {/* ─── ORDER SUMMARY ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-[#1a120b] text-base">Ringkasan Pesanan</h3>
              </div>
              <Link
                href="/customer/orders"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
              >
                Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-amber-50/70 p-5 rounded-xl text-center flex flex-col items-center group hover:bg-amber-100 transition-all cursor-default border border-amber-100/60">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-3xl font-bold text-[#1a120b]">03</span>
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Diproses</span>
                </div>
                <div className="bg-blue-50/70 p-5 rounded-xl text-center flex flex-col items-center group hover:bg-blue-100 transition-all cursor-default border border-blue-100/60">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-3xl font-bold text-[#1a120b]">01</span>
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Dikirim</span>
                </div>
                <div className="bg-emerald-50/70 p-5 rounded-xl text-center flex flex-col items-center group hover:bg-emerald-100 transition-all cursor-default border border-emerald-100/60">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-3xl font-bold text-[#1a120b]">12</span>
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">Selesai</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── INFORMASI PRIBADI ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-[#1a120b] text-base">Informasi Pribadi</h3>
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
                      setEditForm({ name: user.name, address: user.address });
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
                      placeholder="Nama lengkap Anda"
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
                      placeholder="Alamat lengkap Anda"
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
                    <p className="text-sm font-medium text-[#1a120b]">{user.name}</p>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#1a120b]">{user.email}</p>
                      <button onClick={handleCopyEmail} className="text-amber-500 hover:text-amber-600 transition-colors shrink-0" title="Salin email">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="border-b border-amber-100 pb-3">
                    <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Alamat</label>
                    <p className="text-sm font-medium text-[#1a120b]">{user.address || <span className="text-gray-400 italic">Belum diisi</span>}</p>
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

          {/* ─── POIN REWARD ─── */}
          <div className="relative rounded-2xl overflow-hidden group bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 shadow-xl">
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
                <span className="text-[10px] text-amber-300/70 uppercase tracking-[0.2em] font-bold">Poin Heritage</span>
                <Gift className="w-5 h-5 text-amber-300/60" />
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">2.450</span>
                <span className="text-xs text-amber-300/60 ml-1.5 font-medium">PTS</span>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] text-amber-300/50 uppercase tracking-wider font-semibold border-b border-white/10 pb-2">Log Aktivitas Terbaru</h4>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-200/70">Pembelian Kain Ulos</span>
                  <span className="text-emerald-400 font-medium">+150 Pts</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-200/70">Ulasan Tenun Ikat</span>
                  <span className="text-emerald-400 font-medium">+25 Pts</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-200/70">Redeem Voucher Ongkir</span>
                  <span className="text-red-400 font-medium">-100 Pts</span>
                </div>
              </div>

              <button className="w-full py-3 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-sm">
                Tukar Poin
              </button>
            </div>
          </div>

          {/* ─── ARTISAN JOURNEY ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif font-bold text-[#1a120b] text-base">Artisan Journey</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Tier Berikutnya: Master</span>
                    <span className="text-amber-700 font-bold">85%</span>
                  </div>
                  <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic leading-relaxed">
                  Belanja 1 item tenun lagi untuk mencapai status Master Artisan dan nikmati gratis ongkir seumur hidup.
                </p>
              </div>
            </div>
          </div>

          {/* ─── QUICK MENU ─── */}
          <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100">
              <h3 className="font-serif font-bold text-[#1a120b] text-base">Menu Cepat</h3>
            </div>
            <div className="p-3">
              {[
                { icon: LayoutDashboard, label: 'Dashboard', href: '/customer/profile', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: ShoppingBag, label: 'Pesanan Saya', href: '/customer/orders', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: Heart, label: 'Produk Favorit', href: '#', color: 'text-red-600', bg: 'bg-red-50' },
                { icon: MapPin, label: 'Alamat Saya', href: '#', color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
