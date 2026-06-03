'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  code: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: string;
  maxDiscount: string;
  minOrderAmount: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  isActive: boolean;
}

export default function AddPromoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: '',
    maxDiscount: '',
    minOrderAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('no_token');
      setSubmitting(false);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    const payload = {
      code: form.code.toUpperCase(),
      description: form.description,
      type: form.type,
      value: parseFloat(form.value),
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(`${API_URL}/promos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal menambahkan promo');
      }

      router.push('/admin/promos');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setSubmitting(false);
    }
  };

  if (error === 'no_token') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Akses Terbatas</h2>
          <p className="text-gray-500 text-sm mb-8">Anda perlu masuk untuk mengakses halaman ini</p>
          <a href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md w-full">
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Header Section */}
      <div className="relative bg-[#1a0f08] overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600/70">
                <path d="M20 12V8h-4M12 4h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                <path d="M4 14h4v4M8 10H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8"/>
              </svg>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Tambah Promo
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Buat kode promo baru untuk pelanggan TenunKita
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
              <div className="w-2 h-2 bg-amber-600/50 rotate-45" />
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
            </div>
          </div>
        </div>
        <div className="h-6 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pt-24 md:pt-28">
        <div className="mb-6">
          <Link
            href="/admin/promos"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali ke daftar promo
          </Link>
        </div>

        {error && error !== 'no_token' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-amber-200/40 shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kode Promo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Kode Promo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="Contoh: HEMAT50"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all uppercase"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kode akan otomatis dikonversi menjadi huruf kapital</p>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Contoh: Diskon 50% minimal belanja Rp 100.000"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all resize-none"
              />
            </div>

            {/* Tipe Diskon */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Tipe Diskon <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              >
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED">Nominal Tetap (Rp)</option>
              </select>
            </div>

            {/* Nilai Diskon */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Nilai Diskon <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                required
                min={0}
                step={form.type === 'PERCENTAGE' ? 1 : 1000}
                placeholder={form.type === 'PERCENTAGE' ? 'Contoh: 30' : 'Contoh: 50000'}
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {form.type === 'PERCENTAGE' ? 'Masukkan angka persentase (1-100)' : 'Masukkan nominal diskon dalam Rupiah'}
              </p>
            </div>

            {/* Maksimal Diskon (khusus persentase) */}
            {form.type === 'PERCENTAGE' && (
              <div>
                <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                  Maksimal Diskon (Rp)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={form.maxDiscount}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                  placeholder="Contoh: 50000"
                  className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tidak ada batasan maksimal diskon</p>
              </div>
            )}

            {/* Minimal Belanja */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Minimal Belanja (Rp)
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={form.minOrderAmount}
                onChange={handleChange}
                min={0}
                step={1000}
                placeholder="Contoh: 100000"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tanpa minimal belanja</p>
            </div>

            {/* Batas Penggunaan */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Batas Penggunaan
              </label>
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit}
                onChange={handleChange}
                min={1}
                placeholder="Contoh: 100"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tidak ada batas penggunaan</p>
            </div>

            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Tanggal Mulai
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika promo berlaku segera</p>
            </div>

            {/* Tanggal Berakhir */}
            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Tanggal Berakhir
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika promo tidak memiliki tanggal berakhir</p>
            </div>

            {/* Status Aktif */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-400"
                />
                <span className="text-sm font-medium text-[#1a120b]">Aktifkan promo segera</span>
              </label>
              <p className="text-[11px] text-gray-400 mt-1 ml-7">
                Promo akan langsung dapat digunakan oleh pelanggan jika dicentang
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                  </svg>
                  Simpan Promo
                </>
              )}
            </button>
            <Link
              href="/admin/promos"
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-all border border-amber-200/60 hover:border-amber-300"
            >
              Batal
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
            </svg>
            <div className="w-6 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs font-medium">TenunKita Admin v1.0</p>
        </div>
      </div>
    </div>
  );
}