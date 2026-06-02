'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingCart, ChevronRight, Package, Store } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import type { ProductItem } from '@/lib/api';

const BatikDivider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

const categories = [
  { name: 'Semua', slug: '' },
  { name: 'Tenun Ikat', slug: 'tenun-ikat' },
  { name: 'Batik Tulis', slug: 'batik-tulis' },
  { name: 'Songket', slug: 'songket' },
  { name: 'Anyaman', slug: 'anyaman' },
];

export default function CustomerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [filtered, setFiltered] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('terbaru');
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.getProducts();
      const data = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error('Gagal memuat produk:', err);
      setProducts([]);
      setFiltered([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/sign-in'); return; }
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'ADMIN') { router.push('/admin/profile'); return; }
    } catch { router.push('/sign-in'); }
  }, [router]);

  useEffect(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter(
        (p) => p.category?.name?.toLowerCase().replace(/\s+/g, '-') === activeCategory
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'termurah':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'termahal':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.averageRating - a.averageRating);
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFiltered(result);
  }, [search, sort, products, activeCategory]);

  const handleAddToCart = async (productId: number) => {
    try {
      await api.addToCart(productId);
      setCartCount((c) => c + 1);
    } catch {
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/sign-in'); return; }
      alert('Gagal menambahkan ke keranjang. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0e6d4] relative flex items-center justify-center">
        {/* Background batik patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23b8863c'/%3E%3C/svg%3E")`,
            backgroundSize: '70px 70px',
          }}
        />
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-xl animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-8 border border-amber-600/40 rounded" />
          </div>
          <p className="text-amber-800 font-serif text-lg">Menjelajahi koleksi...</p>
          <div className="w-48 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0e6d4] relative">
      {/* Background batik patterns — sama seperti landing page */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23b8863c'/%3E%3C/svg%3E")`,
          backgroundSize: '70px 70px',
        }}
      />
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a120b] via-[#2a1a0e] to-[#1a0f08] -mt-[95px]">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L37.5 22.5L60 30L37.5 37.5L30 60L22.5 37.5L0 30L22.5 22.5Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 pt-[95px] sm:pt-[95px] relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-amber-600/60" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Koleksi Produk</span>
              <div className="w-12 h-px bg-amber-600/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Jelajahi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Koleksi Tenun
              </span>{' '}
              Nusantara
            </h1>
            <p className="text-amber-100/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Temukan kain tenun tradisional dari pengrajin berbakat di seluruh Indonesia,
              dari Sabang sampai Merauke.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0e6d4] to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt30 relative z-10">

        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium">Produk</span>
        </div>

        {/* ─── SEARCH & FILTER BAR ─── */}
        <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 shadow-sm px-4 md:px-6 py-3 md:py-4 mb-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            }}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder:text-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2.5 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all appearance-none cursor-pointer pr-8"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="termurah">Termurah</option>
                  <option value="termahal">Termahal</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <Link
                href="/customer/cart"
                className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-all shadow-sm text-sm font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Keranjang</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-amber-800/30 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug === activeCategory ? '' : cat.slug)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${activeCategory === cat.slug
                  ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                  : 'bg-amber-900/20 text-amber-100/60 border-amber-700/40 hover:border-amber-500 hover:text-amber-200'
                  }`}
              >
                {cat.name}
                {cat.slug && activeCategory !== cat.slug && (
                  <span className="ml-1.5 text-[10px] opacity-50">•</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── RESULTS HEADER ─── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              <Store className="w-3 h-3 text-amber-700" />
            </div>
            <p className="text-sm text-amber-900">
              Menampilkan <span className="font-semibold text-amber-500">{filtered.length}</span> Produk
              {activeCategory && (
                <span className="text-amber-600"> — {categories.find(c => c.slug === activeCategory)?.name || activeCategory}</span>
              )}
              {search && (
                <> untuk &ldquo;<span className="font-semibold text-amber-700">{search}</span>&rdquo;</>
              )}
            </p>
          </div>
          {(search || activeCategory) && (
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); setSort('terbaru'); }}
              className="text-xs text-amber-700 hover:text-amber-600 font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* ─── PRODUCT GRID ─── */}
        {filtered.length === 0 ? (
          <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 shadow-sm p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                backgroundSize: '35px 35px',
              }}
            />
            <div className="w-20 h-20 mx-auto mb-5 bg-amber-800/30 rounded-full flex items-center justify-center border border-amber-700/40">
              <Package className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-amber-100 mb-1">Produk tidak ditemukan</h3>
            <p className="text-amber-100/50 text-sm">Coba gunakan kata kunci atau filter lain</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory(''); setSort('terbaru'); }}
              className="mt-6 px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-14 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
            </svg>
            <div className="w-12 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
          <p className="text-gray-400/60 text-[11px] mt-1">
            &copy; {new Date().getFullYear()} TenunKita. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
