'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: number;
  category: { id: number; name: string };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
  });
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    Promise.all([
      fetch(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([catRes, prodRes]) =>
        Promise.all([catRes.json(), prodRes.json()])
      )
      .then(([catResult, prodResult]) => {
        const catData: Category[] = Array.isArray(catResult) ? catResult : (catResult.data || []);
        setCategories(catData);

        const product: ProductData = prodResult.data || prodResult;
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
          imageUrl: product.imageUrl || '',
          categoryId: String(product.categoryId),
        });

        setIsLoading(false);
      })
      .catch(() => {
        setError('fetch_error');
        setIsLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('categoryId', form.categoryId);

    if (imageSource === 'upload' && imageFile) {
      formData.append('image', imageFile);
    } else if (imageSource === 'url' && form.imageUrl.trim()) {
      setProcessingImage(true);
      try {
        const proxyRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'url', url: form.imageUrl.trim() }),
        });
        const proxyData = await proxyRes.json();
        if (!proxyRes.ok) {
          throw new Error(proxyData.error || 'Gagal memproses gambar');
        }
        const imgRes = await fetch(proxyData.dataUrl);
        const blob = await imgRes.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `product-image.${ext}`, { type: blob.type });
        formData.append('image', file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal mengunduh gambar');
        setSubmitting(false);
        setProcessingImage(false);
        return;
      }
      setProcessingImage(false);
    }

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui produk');
      }

      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setSubmitting(false);
    }
  };

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
          <p className="text-amber-800 font-serif text-lg">Memuat data produk...</p>
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

  if (error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-8">Terjadi kesalahan saat memuat data produk</p>
          <button onClick={() => window.location.reload()} className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
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
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Edit Produk
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Perbarui informasi produk TenunKita
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

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pt-24 md:pt-28">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali ke produk
          </Link>
        </div>

        {error && error !== 'no_token' && error !== 'fetch_error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-amber-200/40 shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama produk"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Masukkan deskripsi produk"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min={0}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-1.5">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1a120b] mb-3">
                Gambar Produk <span className="text-gray-400 font-normal">(opsional)</span>
              </label>

              {/* Toggle source */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setImageSource('url')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    imageSource === 'url'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-500 border-amber-200/60 hover:border-amber-300'
                  }`}
                >
                  URL Eksternal
                </button>
                <button
                  type="button"
                  onClick={() => setImageSource('upload')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    imageSource === 'upload'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-500 border-amber-200/60 hover:border-amber-300'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {imageSource === 'url' ? (
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => { handleChange(e); setImageFile(null); setImagePreview(null); }}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full px-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-8 bg-white border-2 border-dashed border-amber-200/60 rounded-xl text-center cursor-pointer hover:border-amber-300 transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 text-amber-400">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">Klik untuk pilih file gambar</p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP — Maks 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Ukuran file maksimal 5MB');
                        return;
                      }
                      setImageFile(file);
                      setForm({ ...form, imageUrl: '' });
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setImagePreview(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-1.5">
                {imageSource === 'url' ? 'Masukkan URL gambar eksternal' : 'Upload gambar dari perangkat Anda'}
              </p>
            </div>
          </div>

          {(imagePreview || form.imageUrl) && (
            <div className="border border-amber-200/40 rounded-xl p-4 bg-amber-50/30">
              <p className="text-xs font-semibold text-gray-500 mb-2">Pratinjau Gambar</p>
              <div className="relative w-32 h-32">
                <img
                  src={imagePreview || form.imageUrl}
                  alt="Pratinjau"
                  className="w-full h-full object-cover rounded-lg border border-amber-200"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    img.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-amber-50', 'rounded-lg');
                    const fallback = document.createElement('span');
                    fallback.className = 'text-amber-400 text-xs font-medium';
                    fallback.textContent = 'Gambar tidak tersedia';
                    if (!img.parentElement?.querySelector('.fallback-text')) {
                      img.after(fallback);
                      fallback.classList.add('fallback-text');
                    }
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || processingImage}
              className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {processingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses gambar...
                </>
              ) : submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-xl transition-all border border-amber-200/60 hover:border-amber-300"
            >
              Batal
            </Link>
          </div>
        </form>

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
