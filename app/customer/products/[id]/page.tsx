'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  ChevronRight,
  Star,
  Package,
  Minus,
  Plus,
  Check,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  BoxIcon,
  MessageSquare,
  User,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { ProductItem, Review } from '@/lib/api';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

/* Batik SVG background pattern */
const BATIK_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L37.5 22.5L60 30L37.5 37.5L30 60L22.5 37.5L0 30L22.5 22.5Z' fill='%23c4944a'/%3E%3C/svg%3E")`;

// Product Card Component untuk Related Products
function RelatedProductCard({ product, onAddToCart }: { product: ProductItem; onAddToCart: (id: number) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgSrc = product.imageUrl && !imgError ? product.imageUrl : '/placeholder-product.svg';
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="relative group">
      <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-xl border border-amber-700/30 overflow-hidden hover:border-amber-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20">
        {/* Batik pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px',
          }}
        />

        {/* Image Container */}
        <Link href={`/customer/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-amber-900/30">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          {product.stock < 1 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">Habis</span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <div className="absolute top-2 right-2 bg-amber-600/90 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg">
              Sisa {product.stock}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1 truncate">
              {product.category.name}
            </p>
          )}

          {/* Name */}
          <Link href={`/customer/products/${product.id}`}>
            <h3 className="font-serif font-semibold text-amber-100 text-sm line-clamp-2 hover:text-amber-300 transition-colors min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5">
              {stars.map((s) => (
                <Star key={s}
                  className={`w-2.5 h-2.5 ${s <= Math.round(product.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-amber-800/50'}`} />
              ))}
            </div>
            <span className="text-[10px] text-amber-400/50">
              ({product.totalReviews})
            </span>
          </div>

          {/* Price */}
          <div className="mt-2">
            <span className="text-sm font-bold text-amber-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[9px] text-amber-400/50">
              {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product.id)}
            disabled={isAdding || product.stock < 1}
            className="w-full mt-3 py-2 bg-gradient-to-r from-amber-700/50 to-amber-800/50 hover:from-amber-600 hover:to-amber-700 rounded-lg text-[11px] font-semibold text-amber-100 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-700/30"
          >
            {isAdding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Review Card Component
function ReviewItem({ review }: { review: Review }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-5 shadow-lg overflow-hidden group hover:border-amber-600/50 transition-all duration-300">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
          backgroundSize: '25px 25px',
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-800 flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <p className="font-semibold text-amber-100 text-sm">
                {review.user?.name || 'Pengguna TenunKita'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {stars.map((s) => (
                    <Star key={s}
                      className={`w-3 h-3 ${s <= review.score
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-amber-800/50'}`} />
                  ))}
                </div>
                <span className="text-xs text-amber-400/50">{review.score}/5</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-400/40">
            <Calendar className="w-3 h-3" />
            <span>{new Date(review.createdAt).toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {review.comment && (
          <div className="mt-3 pt-3 border-t border-amber-700/30">
            <p className="text-amber-100/70 text-sm leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [related, setRelated] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newScore, setNewScore] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await api.getProductById(id);
      const data = (res as { data?: ProductItem }).data ?? (res as ProductItem);
      setProduct(data);
    } catch {
      router.push('/customer/products');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  useEffect(() => {
    if (!product?.category?.name) return;
    api.getProducts().then((res) => {
      const all = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
      const sameCat = all.filter(
        (p) => p.id !== product.id && p.category?.name === product.category?.name
      );
      setRelated(sameCat.slice(0, 4));
    }).catch(() => { });
  }, [product]);

  useEffect(() => {
    if (!id) return;
    api.getReviews(id).then(setReviews).catch(() => { }).finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/sign-in'); return; }
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'ADMIN') { router.push('/admin/profile'); return; }
    } catch { router.push('/sign-in'); }
  }, [router]);

  const handleAddToCart = async () => {
    if (isAdding || !product || product.stock < 1) return;
    setIsAdding(true);
    try {
      await api.addToCart(product.id, quantity);
      setAdded(true);
      setCartCount((c) => c + quantity);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert('Gagal menambahkan ke keranjang. Silakan coba lagi.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddRelatedToCart = async (productId: number) => {
    try {
      await api.addToCart(productId);
      alert('Berhasil ditambahkan ke keranjang!');
    } catch {
      alert('Gagal menambahkan ke keranjang.');
    }
  };

  const handleSubmitRating = async () => {
    if (submittingRating || newScore === 0) return;
    setSubmittingRating(true);
    try {
      await api.createRating(product!.id, newScore, newComment);
      setNewScore(0);
      setNewComment('');
      setShowRatingForm(false);
      const updated = await api.getReviews(id);
      setReviews(updated);
    } catch {
      alert('Gagal mengirim ulasan. Silakan coba lagi.');
    } finally {
      setSubmittingRating(false);
    }
  };

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0f08] via-[#2d1a0e] to-[#1a0f08] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: BATIK_BG, backgroundSize: '60px 60px' }} />
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/30 rotate-45 rounded-xl animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/40 -rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/60 rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-[22px] bg-amber-600/20 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-amber-300 font-serif text-lg tracking-wide">Memuat detail produk...</p>
          <div className="w-48 h-0.5 bg-amber-900 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-1/2 h-full bg-amber-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0f08] via-[#2d1a0e] to-[#1a0f08] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: BATIK_BG, backgroundSize: '60px 60px' }} />
        <div className="text-center">
          <Package className="w-16 h-16 text-amber-600/60 mx-auto mb-4" />
          <h2 className="font-serif font-bold text-2xl text-amber-100">Produk tidak ditemukan</h2>
          <p className="text-amber-100/50 text-sm mt-2 mb-6">Produk yang Anda cari tidak tersedia.</p>
          <Link href="/customer/products"
            className="inline-block px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-900/40">
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = product.imageUrl && !imgError ? product.imageUrl : '/placeholder-product.svg';
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

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
      {/* ─── HERO BANNER ─── */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 pt-[95px] sm:pt-[95px] relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-amber-600/60" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Detail Produk</span>
              <div className="w-12 h-px bg-amber-600/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {product.name}
            </h1>
            {product.category && (
              <p className="text-amber-100/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Kategori: {product.category.name}
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0e6d4] to-transparent" />
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt30 relative z-10">
        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-amber-800/50 mb-6 pt-4">
          <Link href="/" className="hover:text-amber-700 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/customer/products" className="hover:text-amber-700 transition-colors">Produk</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ─── PRODUCT DETAIL ─── */}
        <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-3xl border border-amber-700/30 shadow-xl shadow-amber-900/20 overflow-hidden mb-8">
          {/* Batik pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">

            {/* ── IMAGE PANEL ── */}
            <div className="relative bg-gradient-to-br from-amber-900/30 to-amber-800/10 p-4 lg:p-6 flex items-center justify-center">
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />

              <div className="relative w-full">
                <div className="absolute -inset-8 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-full blur-2xl" />
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-900/20 shadow-2xl shadow-amber-900/40">
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-contain object-center p-4 hover:scale-105 transition-transform duration-500"
                    onError={() => setImgError(true)}
                  />
                  {product.stock < 1 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-600/90 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        Stok Habis
                      </span>
                    </div>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <div className="absolute top-3 right-3 bg-amber-600/95 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                      Sisa {product.stock} lagi!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── INFO PANEL ── */}
            <div className="border-t lg:border-t-0 lg:border-l border-amber-700/30 p-5 lg:p-7 flex flex-col gap-4">
              {product.category && (
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-900/40 text-amber-300 text-xs font-semibold rounded-full border border-amber-600/40">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {product.category.name}
                  </span>
                </div>
              )}

              <div>
                <h1 className="font-serif font-bold text-xl lg:text-2xl text-amber-100 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-0.5">
                    {stars.map((s) => (
                      <Star key={s}
                        className={`w-3.5 h-3.5 ${s <= Math.round(product.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-amber-800/50'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-amber-300">
                    {product.averageRating > 0 ? product.averageRating.toFixed(1) : '—'}
                  </span>
                  <span className="text-amber-700/50">•</span>
                  <span className="text-sm text-amber-100/50">{product.totalReviews} ulasan</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-900/30 to-transparent rounded-xl p-4 -mx-4 px-4">
                <p className="text-xs text-amber-400/60 uppercase tracking-wider mb-1">Harga</p>
                <span className="text-3xl lg:text-4xl font-bold text-amber-400">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-wider mb-2">Deskripsi</h3>
                <p className="text-amber-100/70 text-sm leading-relaxed">
                  {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <BoxIcon className="w-4 h-4 text-amber-500/60" />
                <span className="text-sm text-amber-100/60">
                  Stok: <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                  </span>
                </span>
              </div>

              {product.stock > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-wider mb-2">Jumlah</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-9 h-9 rounded-full border border-amber-600/40 bg-amber-900/20 flex items-center justify-center hover:bg-amber-800/30 hover:border-amber-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                    <span className="w-10 text-center font-semibold text-lg text-amber-200">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="w-9 h-9 rounded-full border border-amber-600/40 bg-amber-900/20 flex items-center justify-center hover:bg-amber-800/30 hover:border-amber-500/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock < 1}
                className="w-full mt-2"
              >
                {added ? (
                  <span className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 rounded-xl font-semibold text-sm transition-all">
                    <Check className="w-4 h-4" /> Ditambahkan ke Keranjang
                  </span>
                ) : isAdding ? (
                  <span className="flex items-center justify-center gap-2 w-full py-3 bg-amber-800/40 text-amber-300 border border-amber-600/50 rounded-xl font-semibold text-sm">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Menambahkan...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-900/40">
                    <ShoppingCart className="w-4 h-4" /> Tambahkan ke Keranjang
                  </span>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 p-2.5 bg-amber-900/20 rounded-xl border border-amber-700/30">
                  <div className="w-7 h-7 rounded-full bg-amber-800/40 flex items-center justify-center shrink-0">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-amber-200">Gratis Ongkir</p>
                    <p className="text-[9px] text-amber-400/50">Min. belanja Rp150rb</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-amber-900/20 rounded-xl border border-amber-700/30">
                  <div className="w-7 h-7 rounded-full bg-amber-800/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-amber-200">Produk Asli</p>
                    <p className="text-[9px] text-amber-400/50">Garansi 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1a120b]">Ulasan Pembeli</h2>
            <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
              {product.totalReviews}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-300/50 to-transparent" />
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-900/20">
              {showRatingForm ? 'Batal' : '+ Tulis Ulasan'}
            </button>
          </div>

          {/* Rating form */}
          {showRatingForm && (
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-6 mb-8 shadow-xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="relative z-10">
                <h3 className="font-serif font-semibold text-amber-100 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  Beri Rating & Ulasan
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  {stars.map((star) => (
                    <button key={star} type="button" onClick={() => setNewScore(star)} className="p-1 transition-transform hover:scale-110">
                      <Star className={`w-8 h-8 transition-all ${star <= newScore ? 'fill-amber-500 text-amber-500' : 'text-amber-700/40'}`} />
                    </button>
                  ))}
                  <span className="text-sm text-amber-400/60 ml-2">
                    {newScore > 0 ? `${newScore}/5` : 'Pilih rating'}
                  </span>
                </div>
                <textarea
                  placeholder="Tulis ulasan Anda..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-amber-900/20 border border-amber-700/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 resize-none text-amber-100 placeholder:text-amber-400/40"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSubmitRating}
                    disabled={submittingRating || newScore === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:from-amber-800 disabled:to-amber-800 disabled:text-amber-400/40 text-white text-sm font-bold rounded-xl transition-all shadow-md disabled:cursor-not-allowed">
                    {submittingRating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengirim...
                      </span>
                    ) : 'Kirim Ulasan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviewsLoading ? (
            <div className="flex items-center justify-center gap-3 text-sm text-amber-400/60 py-12">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              Memuat ulasan...
            </div>
          ) : reviews.length === 0 ? (
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 py-16 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-amber-500/50" />
                </div>
                <p className="text-amber-200/60 text-sm">Belum ada ulasan untuk produk ini.</p>
                <p className="text-amber-400/40 text-xs mt-1">Jadilah yang pertama memberikan ulasan!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-amber-500 rounded-full" />
              <h2 className="font-serif font-bold text-xl text-[#1a120b]">Produk Terkait</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-300/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p) => (
                <RelatedProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={handleAddRelatedToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ORNAMENT ── */}
        <div className="text-center py-8 border-t border-amber-300/40 mt-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-16 h-px bg-amber-600/30" />
            <svg width="12" height="12" viewBox="0 0 16 16" className="text-amber-600/50">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
            </svg>
            <div className="w-16 h-px bg-amber-600/30" />
          </div>
          <p className="text-amber-800/50 text-xs tracking-widest uppercase">TenunKita — Warisan Budaya Nusantara</p>
          <p className="text-amber-700/40 text-[11px] mt-1">&copy; {new Date().getFullYear()} TenunKita. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}