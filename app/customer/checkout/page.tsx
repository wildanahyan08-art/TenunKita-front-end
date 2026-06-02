'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Package,
  ClipboardList,
  Banknote,
  Info,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { CheckoutResponse } from '@/lib/api';

const BatikDivider = () => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function CustomerCheckoutPage() {
  const router = useRouter();
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/sign-in'); return; }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role === 'ADMIN') { router.push('/admin/profile'); return; }
    } catch {
      router.push('/sign-in');
    }
  }, [router]);

  useEffect(() => {
    const processCheckout = async () => {
      try {
        const res = await api.checkout();
        setResult(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memproses checkout');
      } finally {
        setIsLoading(false);
      }
    };
    processCheckout();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memproses pesanan Anda...</p>
          <p className="text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf6f0]">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#1a120b]">Checkout Gagal</h2>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md"
            >
              Coba Lagi
            </button>
            <Link
              href="/customer/cart"
              className="px-6 py-3 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-medium transition-all"
            >
              Kembali ke Keranjang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/customer/profile" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/customer/cart" className="hover:text-amber-600 transition-colors">Keranjang</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium">Checkout</span>
        </div>

        {/* ─── SUCCESS HEADER ─── */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a120b]">Pesanan Berhasil Dibuat!</h1>
          <p className="text-gray-500 text-sm mt-2">{result.message}</p>
        </div>

        <BatikDivider />

        {/* ─── ORDER DETAILS ─── */}
        <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden mt-6">
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/30">
            <h2 className="font-serif font-bold text-[#1a120b] text-base">Detail Pesanan</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">ID Pesanan</p>
                <p className="font-bold text-[#1a120b] text-lg">#{result.orderId}</p>
              </div>
            </div>

            <div className="h-px bg-amber-100" />

            <div className="flex items-start gap-3">
              <Banknote className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Pembayaran</p>
                <p className="font-bold text-amber-700 text-xl">{formatPrice(result.totalAmount)}</p>
              </div>
            </div>

            <div className="h-px bg-amber-100" />

            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
                <span className="inline-block mt-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
                  {result.status}
                </span>
              </div>
            </div>

            <div className="h-px bg-amber-100" />

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Instruksi</p>
                <p className="text-sm text-gray-600 mt-1">{result.instruction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PAYMENT REMINDER ─── */}
        <div className="mt-4 px-5 py-4 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#1a120b]">Belum melakukan pembayaran?</p>
            <p className="text-xs text-gray-500 mt-1">
              Segera unggah bukti pembayaran Anda di halaman pesanan untuk mempercepat proses verifikasi.
            </p>
            </div>
          </div>

          {/* ─── ACTIONS ─── */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/customer/orders"
              className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md text-center flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" /> Lihat Pesanan Saya
            </Link>
            <Link
              href="/customer/products"
            className="w-full sm:w-auto px-6 py-3 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-medium transition-all text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Belanja Lagi
          </Link>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="mt-12 text-center">
          <BatikDivider />
          <p className="text-gray-400 text-[11px] mt-4 tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
        </div>

      </div>
    </div>
  );
}
