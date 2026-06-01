'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminOrder, OrderStatus } from '@/lib/api';
import { api } from '@/lib/api';

function normalizeOrder(raw: unknown): AdminOrder {
  const o = raw as Record<string, unknown>;
  return {
    id: o.id as number,
    userId: o.userId as number,
    totalAmount: o.totalAmount as number,
    status: o.status as OrderStatus,
    createdAt: o.createdAt as string,
    updatedAt: o.updatedAt as string,
    user: {
      name: ((o.user as Record<string, unknown>)?.name as string) ?? '',
      email: ((o.user as Record<string, unknown>)?.email as string) ?? '',
    },
    orderItems: ((o.orderItems as Array<Record<string, unknown>>) ?? []).map((i) => ({
      id: i.id as number,
      orderId: i.orderId as number,
      productId: i.productId as number,
      quantity: i.quantity as number,
      price: i.price as number,
      createdAt: i.createdAt as string,
      updatedAt: i.updatedAt as string,
      product: { name: ((i.product as Record<string, unknown>)?.name as string) ?? '' },
    })),
    payment: {
      id: (o.payment as Record<string, unknown>)?.id as number,
      orderId: (o.payment as Record<string, unknown>)?.orderId as number,
      userId: (o.payment as Record<string, unknown>)?.userId as number,
      amount: (o.payment as Record<string, unknown>)?.amount as number,
      paymentMethod: (o.payment as Record<string, unknown>)?.paymentMethod as string,
      paymentStatus: (o.payment as Record<string, unknown>)?.paymentStatus as string,
      paidAt: (o.payment as Record<string, unknown>)?.paidAt as string | null,
      createdAt: (o.payment as Record<string, unknown>)?.createdAt as string,
      updatedAt: (o.payment as Record<string, unknown>)?.updatedAt as string,
    },
  };
}

const statusList: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED'];

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  PENDING: { label: 'Menunggu', color: 'text-yellow-700 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  PROCESSING: { label: 'Diproses', color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  SHIPPED: { label: 'Dikirim', color: 'text-purple-700 bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
      router.push('/dashboard');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data');
        return res.json();
      })
      .then((result) => {
        const raw: Record<string, unknown>[] = Array.isArray(result)
          ? result
          : (Array.isArray((result as Record<string, unknown>).data)
            ? (result as Record<string, unknown>).data as Record<string, unknown>[]
            : []);
        if (raw.length > 0) console.log('Raw order sample:', raw[0]);
        const data = raw.map((o) => normalizeOrder(o));
        if (data.length > 0) console.log('Normalized:', data[0]);
        setOrders(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('fetch_error');
        setIsLoading(false);
      });
  }, [router]);

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(token, orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert('Gagal mengubah status pesanan');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(o.id).includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

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
          <p className="text-amber-800 font-serif text-lg">Memuat pesanan...</p>
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
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Akses Terbatas</h2>
          <p className="text-gray-500 text-sm mb-8">Anda perlu masuk untuk mengakses halaman ini</p>
          <a
            href="/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md w-full"
          >
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-8">Terjadi kesalahan saat mengambil data pesanan. Pastikan endpoint <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-mono">GET /orders</code> tersedia di backend.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Hero header */}
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
              Kelola Pesanan
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Manajemen semua pesanan pelanggan TenunKita
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

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pt-24 md:pt-28">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{orders.length}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Pesanan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Pendapatan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-amber-700">{pendingCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Menunggu Diproses</p>
          </div>
        </div>

        {/* Search + count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="text-sm text-gray-500">
              <strong className="text-[#1a120b]">{filtered.length}</strong> pesanan ditemukan
            </span>
          </div>
          <div className="relative max-w-xs w-full sm:w-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/40 p-12 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-gray-300">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p className="text-gray-500 font-serif text-lg">
              {search ? 'Tidak ada pesanan yang cocok' : 'Belum ada pesanan masuk'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-amber-50/80 border-b border-amber-200/40 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Pelanggan</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2">Tanggal</div>
              <div className="col-span-2 text-right">Item</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-amber-100">
              {filtered.map((order) => {
                const status = statusConfig[order.status] || statusConfig.PENDING;
                const itemCount = order.orderItems?.length ?? 0;
                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors items-center"
                  >
                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                        {order.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1a120b] text-sm">{order.user?.name || '—'}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{order.user?.email || '—'}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border cursor-pointer appearance-none text-center max-w-[110px]
                              ${status.color} ${updatingId === order.id ? 'opacity-50' : ''}
                              focus:outline-none transition-all`}
                          >
                            {statusList.map((s) => {
                              const cfg = statusConfig[s];
                              return (
                                <option key={s} value={s} className="bg-white text-[#1a120b]">
                                  {cfg.label}
                                </option>
                              );
                            })}
                          </select>
                          <span className="w-1 h-1 rounded-full bg-amber-300" />
                          <span className="text-[11px] text-amber-700 font-semibold">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:flex col-span-1 items-center text-sm text-gray-400 font-medium">
                      #{order.id}
                    </div>
                    <div className="hidden md:flex col-span-3 items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                        {order.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-[#1a120b] block truncate">{order.user?.name || '—'}</span>
                        {order.user?.email && (
                          <span className="text-[10px] text-gray-400 truncate block">{order.user.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-end text-sm font-semibold text-[#1a120b]">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border cursor-pointer appearance-none text-center
                          ${status.color} ${updatingId === order.id ? 'opacity-50' : 'hover:ring-2 hover:ring-amber-400/40'}
                          focus:outline-none transition-all`}
                      >
                        {statusList.map((s) => {
                          const cfg = statusConfig[s];
                          return (
                            <option key={s} value={s} className="bg-white text-[#1a120b]">
                              {cfg.label}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-end text-sm text-gray-500">
                      {itemCount > 0 ? `${itemCount} item` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
            </svg>
            <div className="w-6 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs font-medium">TenunKita Admin v1.0</p>
          <p className="text-gray-400/60 text-[11px] mt-1">&copy; {new Date().getFullYear()} TenunKita. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
