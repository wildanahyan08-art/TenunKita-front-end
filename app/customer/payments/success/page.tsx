// app/customer/payments/success/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Download, Home, Receipt, Clock } from 'lucide-react';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);

interface OrderData {
  id: number;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  promoCode: string | null;
  status: string;
  createdAt: string;
  paymentInstruction?: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const hasRedirected = useRef(false);
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Fetch order data - useEffect without redirect
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/sign-in');
      return;
    }

    if (!orderId) {
      router.push('/customer/orders');
      return;
    }

    const fetchOrder = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

      try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data order');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // Separate useEffect for countdown and redirect - using useRef to prevent multiple redirects
  useEffect(() => {
    if (isLoading || error || hasRedirected.current) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to move navigation out of the render phase
          setTimeout(() => {
            if (!hasRedirected.current) {
              hasRedirected.current = true;
              router.push('/customer/orders');
            }
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, error, router]);

  const handleDownloadInvoice = async () => {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order?.orderNumber || orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert('Gagal mengunduh invoice');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-pulse" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg animate-pulse" />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg animate-pulse" />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse" />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memproses pembayaran...</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-2xl flex items-center justify-center border border-red-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Pesanan</h2>
          <p className="text-gray-500 text-sm mb-8">{error}</p>
          <Link
            href="/customer/orders"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all w-full"
          >
            Lihat Pesanan Saya
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-green-700 to-green-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/30" />
            <CheckCircle className="w-12 h-12 text-white" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/30" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
            Pembayaran Berhasil!
          </h1>
          <p className="text-green-100/80 font-serif mt-2">
            Terima kasih telah berbelanja di TenunKita
          </p>
        </div>
        <div className="h-6 bg-gradient-to-b from-green-700 to-[#faf6f0]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 -mt-4">
        {/* Order Info Card */}
        <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-amber-200/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Nomor Pesanan</p>
                <p className="font-mono font-bold text-[#1a120b] text-lg">
                  #{order?.orderNumber || orderId}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {order?.status || 'Pembayaran Berhasil'}
                </span>
                <button
                  onClick={handleDownloadInvoice}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Unduh Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-6">
            {/* Items */}
            <div>
              <h3 className="font-serif font-bold text-[#1a120b] mb-3">Detail Pesanan</h3>
              <div className="space-y-3">
                {order?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-0">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-[#1a120b]">{item.productName}</p>
                        <p className="text-xs text-gray-400">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-[#1a120b]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Instruction */}
            {order?.paymentInstruction && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="font-semibold text-[#1a120b] text-sm">Instruksi Pembayaran</h4>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {order.paymentInstruction}
                </p>
              </div>
            )}

            {/* Totals */}
            <div className="pt-4 border-t border-amber-200/40">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-[#1a120b]">{formatPrice(order?.totalAmount || 0)}</span>
                </div>
                {order?.discountAmount && order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Diskon ({order?.promoCode})</span>
                    <span className="text-green-600">-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-amber-200/40">
                  <span className="font-serif font-bold text-[#1a120b]">Total Dibayar</span>
                  <span className="font-serif font-bold text-amber-700 text-xl">
                    {formatPrice(order?.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/customer/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            Lanjut Belanja
          </Link>
          <Link
            href="/customer/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-amber-50 text-amber-700 font-medium rounded-xl transition-all border border-amber-200"
          >
            <Receipt className="w-4 h-4" />
            Lihat Pesanan Saya
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium rounded-xl transition-all border border-gray-200"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Auto redirect info */}
        {countdown > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Anda akan dialihkan ke halaman pesanan saya dalam {countdown} detik
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
            </svg>
            <div className="w-6 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs font-medium">TenunKita — Warisan Budaya Nusantara</p>
        </div>
      </div>
    </div>
  );
}