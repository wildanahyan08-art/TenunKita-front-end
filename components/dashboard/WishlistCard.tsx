'use client';

import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';

export const WishlistCard = ({ product }: { product: any }) => (
  <div className="bg-white rounded-xl border border-amber-100 overflow-hidden hover:shadow-lg transition-all">
    <div className="relative h-48">
      <Image src={product.image} alt={product.name} fill className="object-cover" />
      <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:text-red-500">
        <Heart className="w-4 h-4" />
      </button>
    </div>
    <div className="p-4">
      <h3 className="font-serif font-semibold text-[#1a120b]">{product.name}</h3>
      <p className="text-amber-700 font-bold mt-1">Rp {product.price.toLocaleString()}</p>
      <button className="w-full mt-3 bg-amber-50 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
      </button>
    </div>
  </div>
);