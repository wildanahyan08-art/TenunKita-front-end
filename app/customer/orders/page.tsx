'use client';

// @ts-nocheck

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, Clock, AlertCircle, ShoppingBag, CreditCard, Upload, CheckCircle, Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { PaymentProofData } from '@/lib/api';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED';

const normalizeStatus = (s: string): OrderStatus => {
  const upper = s?.toUpperCase();
  if (upper === 'PENDING' || upper === 'WAITING' || upper === 'UNPAID') return 'PENDING';
  if (upper === 'PROCESSING') return 'PROCESSING';
  if (upper === 'SHIPPED') return 'SHIPPED';
  if (upper === 'COMPLETED' || upper === 'DELIVERED' || upper === 'SELESAI') return 'COMPLETED';
  return 'PENDING';
};

interface CustomerProduct {
  name: string;
  imageUrl: string | null;
}

interface CustomerOrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: CustomerProduct;
}

interface CustomerPayment {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string | null;
}

interface CustomerOrder {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: CustomerOrderItem[];
  payment: CustomerPayment;
}

const statusList: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED'];

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Menunggu', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  PROCESSING: { label: 'Diproses', color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Dikirim', color: 'text-purple-700 bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  SETTLEMENT: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-50' },
  PAID: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-50' },
  CAPTURE: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-50' },
  PENDING: { label: 'Menunggu', color: 'text-yellow-600 bg-yellow-50' },
  EXPIRED: { label: 'Kadaluwarsa', color: 'text-red-600 bg-red-50' },
  FAILED: { label: 'Gagal', color: 'text-red-600 bg-red-50' },
  REFUND: { label: 'Dikembalikan', color: 'text-gray-600 bg-gray-50' },
};

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

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function CustomerOrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [proofStatus, setProofStatus] = useState<Record<number, string>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleDownloadReceipt = useCallback(async (orderId: number) => {
    if (downloadingId !== null) return;
    setDownloadingId(orderId);
    try {
      const blob = await api.downloadReceipt(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `struk-pesanan-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengunduh struk');
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId]);

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

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const result = await api.getMyOrders(token);
      const raw = (Array.isArray(result) ? result : (result as { data: unknown }).data) as Record<string, unknown>[];

      const data: CustomerOrder[] = raw.map((o) => ({
        id: o.id as number,
        totalAmount: o.totalAmount as number,
        status: normalizeStatus(o.status as string),
        createdAt: o.createdAt as string,
        orderItems: ((o.orderItems as Array<Record<string, unknown>>) ?? []).map((i) => ({
          id: i.id as number,
          productId: i.productId as number,
          quantity: i.quantity as number,
          price: i.price as number,
          product: {
            name: ((i.product as Record<string, unknown>)?.name as string) ?? '',
            imageUrl: ((i.product as Record<string, unknown>)?.imageUrl as string | null) ?? null,
          },
        })),
        payment: {
          id: (o.payment as Record<string, unknown>)?.id as number,
          amount: (o.payment as Record<string, unknown>)?.amount as number,
          paymentMethod: (o.payment as Record<string, unknown>)?.paymentMethod as string,
          paymentStatus: (o.payment as Record<string, unknown>)?.paymentStatus as string,
          paidAt: (o.payment as Record<string, unknown>)?.paidAt as string | null,
        },
      }));

      setOrders(data);

      const unpaid = data.filter(
        (o) => !['SETTLEMENT', 'PAID', 'CAPTURE'].includes(o.payment?.paymentStatus ?? '')
      );

      if (unpaid.length > 0) {
        const results = await Promise.allSettled(
          unpaid.map((o) => api.getPaymentProofs(o.id))
        );
        const statusMap: Record<number, string> = {};
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value.length > 0) {
            const proofs = r.value;
            if (proofs.some((p) => p.status === 'APPROVED')) {
              statusMap[unpaid[i].id] = 'APPROVED';
            } else if (proofs.some((p) => p.status === 'PENDING')) {
              statusMap[unpaid[i].id] = 'PENDING';
            } else if (proofs.some((p) => p.status === 'REJECTED')) {
              statusMap[unpaid[i].id] = 'REJECTED';
            }
          }
        });
        setProofStatus(statusMap);
      }

      setIsLoading(false);
    } catch {
      if (isLoading) {
        setError('Gagal memuat pesanan');
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    fetchData();

    intervalRef.current = setInterval(fetchData, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData]);

  const handleCustomerDelete = async (orderId: number) => {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setDeletingId(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal menghapus pesanan');
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus pesanan');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  const orderCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    COMPLETED: orders.filter((o) => o.status === 'COMPLETED').length,
  };

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
          <p className="text-amber-800 font-serif text-lg">Memuat pesanan...</p>
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
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <Link href="/customer/profile" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium">Pesanan Saya</span>
        </div>

        {/* ─── HEADER ─── */}
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-amber-700" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a120b]">Pesanan Saya</h1>
            <p className="text-gray-500 text-sm mt-1">
              {orders.length > 0 ? `${orders.length} pesanan` : 'Belum ada pesanan'}
            </p>
          </div>
        </div>
        <BatikDivider />

        {/* ─── FILTER TABS ─── */}
        <div className="flex gap-2 mt-6 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {(['ALL', ...statusList] as const).map((key) => {
            const count = orderCounts[key];
            const isActive = filter === key;
            const cfg = key !== 'ALL' ? statusConfig[key] : null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                    : 'bg-white text-gray-500 border-amber-200/60 hover:border-amber-300'
                }`}
              >
                {cfg ? cfg.label : 'Semua'}
                <span className={`ml-1.5 ${isActive ? 'text-amber-200' : 'text-gray-400'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          /* ─── EMPTY STATE ─── */
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1a120b]">
              {filter === 'ALL' ? 'Belum Ada Pesanan' : 'Tidak Ada Pesanan'}
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              {filter === 'ALL'
                ? 'Anda belum melakukan pemesanan. Yuk, mulai belanja kain tenun Nusantara!'
                : `Tidak ada pesanan dengan status ${statusConfig[filter]?.label.toLowerCase()}.`}
            </p>
            <Link
              href="/customer/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" /> Mulai Belanja
            </Link>
          </div>
        ) : (
          /* ─── ORDER LIST ─── */
          <div className="space-y-4">
            {filtered.map((order) => {
              const sCfg = statusConfig[order.status] || statusConfig.PENDING;
              const itemCount = order.orderItems?.length ?? 0;

              const proofSt = proofStatus[order.id];
              let payLabel: string;
              let payColor: string;
              let payIcon: React.ReactNode;
              let isPaid = false;

              if (proofSt === 'APPROVED') {
                payLabel = 'Lunas';
                payColor = 'text-emerald-600 bg-emerald-50';
                payIcon = <CheckCircle className="w-3 h-3" />;
                isPaid = true;
              } else if (proofSt === 'PENDING') {
                payLabel = 'Menunggu Verifikasi';
                payColor = 'text-yellow-700 bg-yellow-50 border border-yellow-200';
                payIcon = <Clock className="w-3 h-3" />;
              } else if (proofSt === 'REJECTED') {
                payLabel = 'Ditolak';
                payColor = 'text-red-600 bg-red-50 border border-red-200';
                payIcon = <AlertCircle className="w-3 h-3" />;
              } else if (order.payment) {
                const paymentStatus = order.payment.paymentStatus;
                const cfg = paymentStatusConfig[paymentStatus];
                payLabel = cfg?.label || paymentStatus || '—';
                payColor = cfg?.color || 'text-gray-600 bg-gray-50';
                payIcon = <CreditCard className="w-3 h-3" />;
                isPaid = ['SETTLEMENT', 'PAID', 'CAPTURE'].includes(paymentStatus);
              } else {
                payLabel = 'Belum Dibayar';
                payColor = 'text-yellow-700 bg-yellow-50 border border-yellow-200';
                payIcon = <CreditCard className="w-3 h-3" />;
              }

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {/* Order header */}
                  <div className="px-5 py-3.5 bg-amber-50/60 border-b border-amber-100 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-xs text-gray-400 font-medium">
                      Pesanan <strong className="text-[#1a120b]">#{order.id}</strong>
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(order.createdAt)}
                    </span>
                    <span className={`ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-md border ${sCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                      {sCfg.label}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="px-5 py-4 space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shrink-0 border border-amber-100">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-300">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1a120b] truncate">{item.product.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#1a120b] shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="px-5 py-3 bg-amber-50/40 border-t border-amber-100 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${payColor} flex items-center gap-1`}>
                      {payIcon} {payLabel}
                    </span>
                    {order.payment?.paymentMethod && (
                      <span className="text-[11px] text-gray-400">{order.payment.paymentMethod}</span>
                    )}
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCustomerDelete(order.id)}
                        disabled={deletingId === order.id}
                        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-40 transition-all"
                      >
                        {deletingId === order.id ? '...' : 'Hapus'}
                      </button>
                    )}
                    {!isPaid && proofSt !== 'PENDING' && proofSt !== 'APPROVED' && (
                      <Link
                        href={`/customer/payments?orderId=${order.id}`}
                        className="ml-auto text-[11px] font-semibold px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Upload className="w-3 h-3" /> Bayar
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(order.id)}
                      disabled={downloadingId === order.id}
                      className={`text-[11px] font-semibold px-3 py-1.5 bg-amber-800 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
                        isPaid || proofSt === 'PENDING' || proofSt === 'APPROVED' ? 'ml-auto' : ''
                      }`}
                    >
                      {downloadingId === order.id ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Mengunduh...</>
                      ) : (
                        <><Download className="w-3 h-3" /> Struk</>
                      )}
                    </button>
                    <span className="text-sm font-bold text-amber-700">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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