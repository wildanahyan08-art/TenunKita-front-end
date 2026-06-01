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
  Store,
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ReviewCard from '@/components/product/ReviewCard';
import { api } from '@/lib/api';
import type { ProductItem, Review } from '@/lib/api';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

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
    }).catch(() => {});
  }, [product]);

  useEffect(() => {
    if (!id) return;
    api.getReviews(id).then(setReviews).catch(() => {}).finally(() => setReviewsLoading(false));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-xl animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-8 border border-amber-600/40 rounded" />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memuat detail produk...</p>
          <div className="w-48 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="font-serif font-bold text-2xl text-[#1a120b]">Produk tidak ditemukan</h2>
          <Link href="/customer/products" className="mt-6 inline-block px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = product.imageUrl && !imgError ? product.imageUrl : '/placeholder-product.svg';

  return (
    <div className="min-h-screen bg-[#faf6f0]">

      {/* ─── HERO HEADER ─── */}
      <div className="relative bg-[#1a0f08] overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="flex items-center gap-2 text-xs mb-4">
            <Link href="/dashboard" className="text-amber-400/60 hover:text-amber-300 transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3 text-amber-600/40" />
            <Link href="/customer/products" className="text-amber-400/60 hover:text-amber-300 transition-colors">Produk</Link>
            <ChevronRight className="w-3 h-3 text-amber-600/40" />
            <span className="text-amber-300 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
              <Store className="w-5 h-5 text-amber-600/70" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Detail Produk
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              {product.category?.name || 'Koleksi TenunKita'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
              <div className="w-2 h-2 bg-amber-600/50 rotate-45" />
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
            </div>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">

        {/* ─── BACK LINK ─── */}
        <Link
          href="/customer/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke produk
        </Link>

        {/* ─── PRODUCT DETAIL ─── */}
        <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-8 md:p-12">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full max-w-md h-auto object-contain rounded-xl"
                onError={() => setImgError(true)}
              />
              {product.stock < 1 && (
                <div className="absolute top-6 left-6 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  Stok Habis
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-6 left-6 bg-amber-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  Sisa {product.stock}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 md:p-10 flex flex-col gap-6">
              {/* Category badge */}
              {product.category && (
                <div>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg">
                    {product.category.name}
                  </span>
                </div>
              )}

              {/* Name */}
              <div>
                <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#1a120b] leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${product.averageRating > 0 ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                  <span className="text-sm font-semibold text-[#1a120b]">
                    {product.averageRating > 0 ? product.averageRating.toFixed(1) : '-'}
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{product.totalReviews} ulasan</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-700">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Deskripsi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                </p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Stok:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                </span>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Jumlah</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl border border-amber-200/60 flex items-center justify-center hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="w-4 h-4 text-[#1a120b]" />
                    </button>
                    <span className="w-14 text-center font-bold text-lg text-[#1a120b]">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-xl border border-amber-200/60 flex items-center justify-center hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus className="w-4 h-4 text-[#1a120b]" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock < 1}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Ditambahkan ke Keranjang
                  </span>
                ) : isAdding ? (
                  <span className="bg-amber-100 text-amber-400 w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Menambahkan...
                  </span>
                ) : (
                  <span className="bg-amber-700 hover:bg-amber-600 text-white w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Tambahkan ke Keranjang
                  </span>
                )}
              </button>

              {/* Info badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#1a120b]">Gratis Ongkir</p>
                    <p className="text-[10px] text-gray-400">Min. belanja Rp150rb</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#1a120b]">Produk Asli</p>
                    <p className="text-[10px] text-gray-400">Garansi 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── REVIEWS ─── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-amber-600 rounded-full" />
            <h2 className="font-serif font-bold text-xl text-[#1a120b]">
              Ulasan ({product.totalReviews})
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-200/60 to-transparent" />
            <button
              onClick={() => setShowRatingForm(!showRatingForm)}
              className="shrink-0 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              {showRatingForm ? 'Batal' : '+ Tulis Ulasan'}
            </button>
          </div>

          {showRatingForm && (
            <div className="bg-white rounded-xl border border-amber-200/40 p-6 mb-6">
              <h3 className="font-semibold text-sm text-[#1a120b] mb-4">Beri Rating & Ulasan</h3>

              {/* Star selector */}
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewScore(star)}
                    className="p-0.5 transition-all"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= newScore ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-2">
                  {newScore > 0 ? `${newScore}/5` : 'Pilih rating'}
                </span>
              </div>

              {/* Comment */}
              <textarea
                placeholder="Tulis ulasan Anda..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-amber-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 resize-none"
              />

              {/* Submit */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitRating}
                  disabled={submittingRating || newScore === 0}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
                >
                  {submittingRating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    'Kirim Ulasan'
                  )}
                </button>
              </div>
            </div>
          )}

          {reviewsLoading ? (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              Memuat ulasan...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-amber-200/40">
              <Star className="w-12 h-12 text-amber-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Belum ada ulasan untuk produk ini.</p>
              <p className="text-gray-400 text-xs mt-1">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* ─── RELATED PRODUCTS ─── */}
        {related.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 bg-amber-600 rounded-full" />
              <h2 className="font-serif font-bold text-xl text-[#1a120b]">Produk Terkait</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-200/60 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={async (productId) => {
                    try {
                      await api.addToCart(productId);
                      setCartCount((c) => c + 1);
                    } catch {
                      alert('Gagal menambahkan ke keranjang.');
                    }
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-6 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
            </svg>
            <div className="w-12 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs tracking-wider">TenunKita — Warisan Budaya Nusantara</p>
          <p className="text-gray-400/60 text-[11px] mt-1">&copy; {new Date().getFullYear()} TenunKita. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
