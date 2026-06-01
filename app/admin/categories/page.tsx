'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { products: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setError('no_token');
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.role !== 'ADMIN') {
      window.location.href = '/dashboard';
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    fetch(`${API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data');
        return res.json();
      })
      .then((result) => {
        const data: Category[] = Array.isArray(result) ? result : (result.data || []);
        setCategories(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('fetch_error');
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal menghapus kategori');

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setConfirmDelete(null);
    } catch {
      alert('Gagal menghapus kategori. Silakan coba lagi.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg" />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg" />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg" />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memuat kategori...</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error === 'no_token') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Akses Terbatas</h2>
          <p className="text-gray-500 text-sm mb-8">Anda perlu masuk untuk mengakses halaman ini</p>
          <a
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md w-full"
          >
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-8">Terjadi kesalahan saat mengambil data kategori</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Hero header */}
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
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-amber-600/70">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
              </svg>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Kelola Kategori
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Manajemen kategori produk TenunKita
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

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pt-24 md:pt-28">
        {/* Stats ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{categories.length}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Kategori</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{totalProducts}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Produk</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">
              {totalProducts > 0 ? (totalProducts / categories.length).toFixed(1) : 0}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Rata-rata / Kategori</p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Link
            href="/admin/categories/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-sm text-sm self-start"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Tambah Kategori
          </Link>

          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span className="text-sm text-gray-500">
              <strong className="text-[#1a120b]">{filtered.length}</strong> kategori ditemukan
            </span>
          </div>
          <div className="relative max-w-xs w-full sm:w-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/40 p-12 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-gray-300">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <p className="text-gray-500 font-serif text-lg">
              {search ? 'Tidak ada kategori yang cocok' : 'Belum ada kategori'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-amber-50/80 border-b border-amber-200/40 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Nama Kategori</div>
              <div className="col-span-3">Deskripsi</div>
              <div className="col-span-1 text-center">Produk</div>
              <div className="col-span-2">Dibuat</div>
              <div className="col-span-2 text-center">Aksi</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-amber-100">
              {filtered.map((cat, index) => (
                <div
                  key={cat.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors items-center"
                >
                  {/* Mobile */}
                  <div className="md:hidden flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1a120b] text-sm">{cat.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.description || '—'}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {cat._count?.products || 0} produk
                        </span>
                        <span className="w-1 h-1 rounded-full bg-amber-300" />
                        <span className="text-[10px] text-gray-400">{formatDate(cat.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/categories/edit/${cat.id}`}
                        className="shrink-0 inline-flex items-center justify-center w-9 h-9 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                        </svg>
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(cat.id)}
                        className="shrink-0 inline-flex items-center justify-center w-9 h-9 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:flex col-span-1 items-center text-sm text-gray-400 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="hidden md:flex col-span-3 items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                      {cat.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-[#1a120b] truncate">{cat.name}</span>
                  </div>
                  <div className="hidden md:flex col-span-3 items-center text-sm text-gray-500 truncate">
                    {cat.description || '—'}
                  </div>
                  <div className="hidden md:flex col-span-1 items-center justify-center">
                    <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                      {cat._count?.products || 0}
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-2 items-center text-sm text-gray-500">
                    {formatDate(cat.createdAt)}
                  </div>
                  <div className="hidden md:flex col-span-2 items-center justify-center gap-2">
                    <Link
                      href={`/admin/categories/edit/${cat.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(cat.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-amber-200/60">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-2xl flex items-center justify-center border border-red-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#1a120b] mb-2">Hapus Kategori</h3>
                <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-all border border-amber-200/60 hover:border-amber-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    disabled={deleting === confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {deleting === confirmDelete ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Menghapus...
                      </>
                    ) : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
          <p className="text-gray-400/60 text-[11px] mt-1">&copy; {new Date().getFullYear()} TenunKita. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
