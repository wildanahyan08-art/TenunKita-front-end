'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  MapPin,
  Calendar,
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
  Shield,
  Copy,
  Check,
  Camera,
} from 'lucide-react';

interface CustomerUser {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  createdAt: string;
}

const BatikDivider = () => (
  <div className="flex items-center gap-2 my-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

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
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
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
  const memberYear = new Date(user.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ─── HERO / COVER ─── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 group">
          <div className="h-44 sm:h-52 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#faf6f0] to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 z-10">
            <div className="flex items-end gap-5">
              <div className="shrink-0 -mb-2">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 border-[3px] border-white shadow-xl flex items-center justify-center overflow-hidden">
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-600 hover:bg-amber-500 border-2 border-white rounded-full flex items-center justify-center shadow-md transition-colors">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
              <div className="pb-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white drop-shadow-sm truncate">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-md tracking-wider border border-white/10">
                    {user.role === 'BUYER' ? 'PEMBELI' : user.role}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 text-[10px] font-semibold rounded-md border border-emerald-400/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ─── PROFILE INFO CARD ─── */}
            <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-amber-600" />
                  <h2 className="font-serif font-bold text-[#1a120b] text-base">Informasi Pribadi</h2>
                </div>
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

              <div className="p-5 sm:p-6 space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
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
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-[0.08em] mb-1.5">
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
                  </>
                ) : (
                  <>
                    <InfoRow
                      icon={<User className="w-4 h-4" />}
                      label="Nama"
                      value={user.name}
                    />
                    <InfoRow
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={user.email}
                      action={
                        <button
                          onClick={handleCopyEmail}
                          className="text-amber-500 hover:text-amber-600 transition-colors"
                          title="Salin email"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      }
                    />
                    <InfoRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Alamat"
                      value={user.address || (
                        <span className="text-gray-400 italic">Belum diisi</span>
                      )}
                    />
                    <InfoRow
                      icon={<Calendar className="w-4 h-4" />}
                      label="Bergabung"
                      value={memberSince}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ─── ORDER SUMMARY ─── */}
            <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <h2 className="font-serif font-bold text-[#1a120b] text-base">Ringkasan Pesanan</h2>
                </div>
                <Link
                  href="/dashboard/orders"
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
                >
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { label: 'Diproses', value: '0', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Dikirim', value: '0', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Selesai', value: '0', icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 sm:p-5 rounded-xl bg-amber-50/50 border border-amber-100/60 hover:border-amber-200/80 transition-all group">
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-[#1a120b]">{item.value}</p>
                      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.08em] mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/produk"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-xl transition-colors text-sm border border-amber-200/60"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Belanja Sekarang
                </Link>
              </div>
            </div>

            {/* ─── RECENT ACTIVITY ─── */}
            <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-amber-100 flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="font-serif font-bold text-[#1a120b] text-base">Aktivitas Terbaru</h2>
              </div>
              <div className="p-5 sm:p-6">
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                  <p className="text-gray-400 text-sm mt-1">Mulai belanja untuk melihat riwayat Anda</p>
                  <Link
                    href="/produk"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
                  >
                    Jelajahi Produk <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-6">

            {/* ─── MEMBER CARD ─── */}
            <div className="relative rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900" />
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="relative p-5 sm:p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-amber-300/80 uppercase tracking-[0.2em] font-bold">Kartu Anggota</p>
                    <p className="font-serif text-base font-bold mt-0.5">TenunKita</p>
                  </div>
                  <Shield className="w-8 h-8 text-amber-300/60" />
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.1em]">Nama</p>
                      <p className="font-semibold text-sm mt-0.5">{user.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-amber-300/60 uppercase tracking-[0.1em]">Sejak</p>
                      <p className="font-semibold text-sm mt-0.5">{memberYear}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-amber-200/70">
                  <Heart className="w-3 h-3" />
                  Member Premium
                </div>
              </div>
            </div>

            {/* ─── QUICK ACTIONS ─── */}
            <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-amber-100">
                <h2 className="font-serif font-bold text-[#1a120b] text-base">Menu Cepat</h2>
              </div>
              <div className="p-3">
                {[
                  { icon: User, label: 'Dashboard', href: '/dashboard', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { icon: ShoppingBag, label: 'Pesanan Saya', href: '/customer/orders', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { icon: Heart, label: 'Produk Favorit', href: '/dashboard/wishlist', color: 'text-red-600', bg: 'bg-red-50' },
                  { icon: MapPin, label: 'Alamat Saya', href: '/dashboard/address', color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

            {/* ─── REWARDS POINTS ─── */}
            <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-600" />
                <h2 className="font-serif font-bold text-[#1a120b] text-base">Poin Reward</h2>
              </div>
              <div className="px-5 sm:px-6 pb-5">
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-amber-700">0</p>
                  <p className="text-xs text-gray-500 mt-1">Total Poin</p>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  Belanja lebih banyak untuk mengumpulkan poin!
                </p>
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

        {/* ─── FOOTER ─── */}
        <BatikDivider />
        <div className="text-center mt-6">
          <p className="text-gray-400 text-xs font-medium tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
          <p className="text-gray-400/60 text-[11px] mt-1">
            &copy; {new Date().getFullYear()} TenunKita. Semua hak dilindungi.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ─── INFO ROW COMPONENT ─── */
function InfoRow({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 py-1 group">
      <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-100 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[#1a120b] mt-0.5 break-words">{value}</p>
          {action && <span className="shrink-0">{action}</span>}
        </div>
      </div>
    </div>
  );
}
