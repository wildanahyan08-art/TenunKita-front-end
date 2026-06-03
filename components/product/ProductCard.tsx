'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import type { ProductItem } from '@/lib/api';

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (productId: number) => void | Promise<void>;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgSrc = product.imageUrl && !imgError ? product.imageUrl : '/placeholder-product.svg';

  const handleClick = async () => {
    if (product.stock < 1) return;
    setIsAdding(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="relative group h-full">
      {/* Sudut diubah ke rounded-xl agar bentuk kotak terlihat lebih tegas dan presisi */}
      <div className="relative overflow-hidden rounded-xl border border-amber-700/30 bg-[#1a120b] shadow-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-amber-900/20 h-full flex flex-col justify-between">
        
        {/* Ornamen Latar Belakang Batik */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px',
          }}
        />

        {/* Bagian Atas: Foto & Detail Teks */}
        <div className="flex flex-col flex-grow">
          
          {/* FOTO KOTAK 1:1 MUTLAK */}
          <div className="relative aspect-square w-full overflow-hidden bg-amber-900/10 border-b border-amber-900/20">
            <Link href={`/customer/products/${product.id}`} className="block w-full h-full">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
              {product.stock < 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white text-[10px] font-semibold tracking-[0.2em] uppercase font-serif backdrop-blur-sm">
                  Habis Belanja
                </div>
              )}
            </Link>
          </div>

          {/* Area Konten Teks (Padding disesuaikan agar compact & proporsional kotak) */}
          <div className="p-3 flex flex-col flex-grow justify-between gap-1">
            <div>
              {/* Kategori */}
              <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 truncate mb-0.5">
                {product.category?.name || 'Wastra Pilihan'}
              </p>

              {/* Nama Produk (Maksimal 2 baris, tinggi pas) */}
              <Link href={`/customer/products/${product.id}`}>
                <h3 className="font-serif text-xs font-semibold text-amber-100 line-clamp-2 hover:text-amber-300 transition-colors leading-tight min-h-[32px]">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating & Stok */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[9px] text-amber-400/60 font-mono">
                {product.averageRating ? product.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="text-[9px] text-amber-500/40 font-serif ml-1 truncate">
                • {product.stock > 0 ? `${product.stock} Tersedia` : 'Habis'}
              </span>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Harga di Kiri, Tombol Icon Sejajar di Kanan */}
        <div className="px-3 pb-3 pt-2 border-t border-amber-900/20 bg-amber-950/20 flex items-center justify-between gap-1.5">
          
          {/* Info Harga */}
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] text-amber-500/40 font-bold tracking-[0.15em] uppercase">Mulia</span>
            <span className="text-xs font-bold text-amber-300 tracking-tight truncate">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Tombol Keranjang Kotak Minimalis */}
          <button
            type="button"
            onClick={handleClick}
            disabled={isAdding || product.stock < 1}
            className="shrink-0 relative overflow-hidden flex items-center justify-center w-8 h-8 rounded-lg border border-amber-600/40 bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 active:scale-90 shadow-md group/btn"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className={`w-3.5 h-3.5 transition-transform ${isAdding ? 'animate-pulse' : 'group-hover/btn:-translate-y-0.5'}`} />
          </button>

        </div>

      </div>
    </div>
  );
}