'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Check, Plus } from 'lucide-react';
import type { ProductItem } from '@/lib/api';

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (productId: number) => Promise<void>;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || product.stock < 1) return;
    setIsAdding(true);
    try {
      await onAddToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // silent
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const imgSrc = product.imageUrl && !imgError ? product.imageUrl : '/placeholder-product.svg';

  return (
    <Link href={`/customer/products/${product.id}`} className="block group h-full">
      <div className="h-full relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 overflow-hidden hover:shadow-lg hover:shadow-amber-900/20 hover:border-amber-600/50 transition-all duration-300 flex flex-col">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px',
          }}
        />
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-900/20 to-amber-800/10 overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {product.stock < 1 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-4 py-1.5 rounded-lg">Stok Habis</span>
            </div>
          )}
          {product.averageRating > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-[#1a0f08]/80 backdrop-blur-sm rounded-lg text-xs font-semibold text-amber-300 shadow-sm border border-amber-700/30">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {product.averageRating.toFixed(1)}
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={isAdding || product.stock < 1}
            className="absolute top-3 right-3 w-9 h-9 bg-[#1a0f08]/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-amber-700/30 hover:bg-amber-600 hover:text-white hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Tambah ke keranjang"
          >
            {added ? <Check className="w-4 h-4 text-emerald-500" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex-1">
            <h3 className="font-serif font-bold text-amber-100 text-sm leading-snug line-clamp-2">
              {product.name}
            </h3>
            {product.category && (
              <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-[0.1em] mt-1">
                {product.category.name}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-amber-400">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-100/40">
            <span className={`${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
            {product.totalReviews > 0 && (
              <>
                <span className="text-amber-700">|</span>
                <span>{product.totalReviews} ulasan</span>
              </>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding || product.stock < 1}
            className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? (
              <span className="bg-emerald-700/30 text-emerald-300 border border-emerald-700/40 w-full py-2.5 rounded-xl flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Ditambahkan
              </span>
            ) : isAdding ? (
              <span className="bg-amber-800/30 text-amber-400 w-full py-2.5 rounded-xl flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                Menambahkan...
              </span>
            ) : (
              <span className="bg-amber-700 hover:bg-amber-600 text-white w-full py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm">
                <ShoppingCart className="w-4 h-4" /> Keranjang
              </span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
