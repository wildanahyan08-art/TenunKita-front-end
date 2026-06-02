'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Pencil,
  X,
  Save,
  Loader2,
  MapPin,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Root {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
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
  const [admin, setAdmin] = useState<Root | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', address: '' });

  const loadFromLocalStorage = useCallback(() => {
    const data = localStorage.getItem('user');
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return { id: parsed.id || 0, name: parsed.name || '', email: parsed.email || '', role: parsed.role || 'ADMIN', address: parsed.address || '' } as Root;
    } catch { return null; }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setIsLoading(false); return; }

    const local = loadFromLocalStorage();
    if (!local) { setIsLoading(false); return; }

    setAdmin(local);
    setForm({ name: local.name, email: local.email, address: local.address });
    setIsLoading(false);
  }, [loadFromLocalStorage]);

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !admin) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.updateProfile(token, { name: form.name, email: form.email, address: form.address });
      const updated: Root = { ...admin, name: form.name, email: form.email, address: form.address };
      setAdmin(updated);
      setForm({ name: updated.name, email: updated.email, address: updated.address || '' });
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      localStorage.setItem('user', JSON.stringify(updated));
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!admin) return;
    setForm({ name: admin.name, email: admin.email, address: admin.address || '' });
    setIsEditing(false);
    setMessage(null);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Profil Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Informasi dan pengaturan akun administrator</p>
        </div>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isEditing
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
              : 'bg-amber-700 text-white hover:bg-amber-600 shadow-sm'
          }`}
        >
          {isEditing ? <><X className="w-4 h-4" /> Batal</> : <><Pencil className="w-4 h-4" /> Edit Profil</>}
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {message.text}
        </div>
      )}

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
          {isEditing ? (
            <>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">Nama</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.1em]">Alamat</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="w-full mt-1 px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-none text-gray-900"
                  />
                </div>
              </div>
              <div className="px-5 py-3 flex items-center justify-end gap-2 bg-amber-50/50">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-amber-700 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={<User className="w-4 h-4" />} label="Nama" value={admin.name || '-'} />
              <InfoRow icon={<Shield className="w-4 h-4" />} label="Peran" value={admin.role || '-'} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={admin.email || '-'} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Alamat" value={admin.address || '-'} />
            </>
          )}
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
