'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { OrderStatus } from '@/lib/api';
import { api } from '@/lib/api';

const statusList: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED'];

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  PROCESSING: { label: 'Diproses', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  SHIPPED: { label: 'Dikirim', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('PENDING');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/sign-in');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data');
        return res.json();
      })
      .then((result) => {
        const raw: Record<string, unknown>[] = Array.isArray(result)
          ? result
          : Array.isArray((result as Record<string, unknown>).data)
            ? (result as Record<string, unknown>).data as Record<string, unknown>[]
            : [];
        const order = raw.find((o) => String(o.id) === orderId);
        if (!order) throw new Error('Pesanan tidak ditemukan');
        const s = order.status as OrderStatus;
        setCurrentStatus(s);
        setSelectedStatus(s);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [orderId, router]);

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setIsUpdating(true);
    setMessage(null);
    setError(null);
    try {
      await api.updateOrderStatus(token, Number(orderId), selectedStatus);
      setCurrentStatus(selectedStatus);
      setMessage('Status berhasil diperbarui');
    } catch (err) {
      setError((err as Error).message || 'Gagal mengubah status');
    } finally {
      setIsUpdating(false);
    }
  };

  const cfg = statusConfig[currentStatus];

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60">
          <p className="text-gray-500">ID pesanan tidak ditemukan</p>
          <a href="/admin/orders" className="mt-4 inline-block text-amber-700 hover:underline text-sm">Kembali</a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-amber-800 font-serif">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-amber-200/60 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-[#1a120b]">Ubah Status Pesanan</h1>
              <p className="text-xs text-gray-400">Pesanan #{orderId}</p>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/30 mb-6">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Status Saat Ini</p>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border ${cfg.color}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.color.split(' ')[0]}`} />
              {cfg.label}
            </span>
          </div>

          <label className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block mb-2">
            Ubah ke
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            disabled={isUpdating}
            className="w-full px-3 py-2.5 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all mb-6"
          >
            {statusList.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          {message && (
            <div className="mb-4 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{message}</div>
          )}

          <div className="flex gap-3">
            <a
              href="/admin/orders"
              className="flex-1 text-center px-4 py-2.5 border border-amber-200/60 text-gray-600 font-medium rounded-xl hover:bg-amber-50 transition-all text-sm"
            >
              Kembali
            </a>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || selectedStatus === currentStatus}
              className="flex-1 px-4 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 text-white font-medium rounded-xl transition-all text-sm"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}
