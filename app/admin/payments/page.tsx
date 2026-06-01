'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BillItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Bill {
  orderId: number;
  userId: number;
  buyerName: string;
  buyerEmail: string;
  totalAmount: number;
  status: string;
  items: BillItem[];
  createdAt: string;
}

interface PaymentData {
  id: number;
  orderId: number;
  fileUrl: string;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}



const PAYMENT_STATUS = ['PENDING', 'VERIFIED', 'REJECTED'] as const;
type PaymentStatus = (typeof PAYMENT_STATUS)[number];

const paymentConfig: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  VERIFIED: { label: 'Terverifikasi', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  REJECTED: { label: 'Ditolak', color: 'text-red-700 bg-red-50 border-red-200' },
};

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Record<number, PaymentData | null>>({});
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
      .then(async (result) => {
        const raw: Record<string, unknown>[] = Array.isArray(result)
          ? result
          : (Array.isArray((result as Record<string, unknown>).data)
            ? (result as Record<string, unknown>).data as Record<string, unknown>[]
            : []);

        if (raw.length > 0) console.log('Raw order sample:', raw[0]);

        const mappedBills: Bill[] = raw.map((o) => ({
          orderId: o.id as number,
          userId: o.userId as number,
          buyerName: ((o.user as Record<string, unknown>)?.name as string) ?? '',
          buyerEmail: ((o.user as Record<string, unknown>)?.email as string) ?? '',
          totalAmount: o.totalAmount as number,
          status: o.status as string,
          items: ((o.orderItems as Array<Record<string, unknown>>) ?? []).map((i) => ({
            productName: ((i.product as Record<string, unknown>)?.name as string) ?? '',
            quantity: i.quantity as number,
            price: i.price as number,
          })),
          createdAt: o.createdAt as string,
        }));

        setBills(mappedBills);

        // Init payment map from order's payment data
        const paymentMap: Record<number, PaymentData | null> = {};
        for (const o of raw) {
          const p = o.payment as Record<string, unknown> | undefined;
          if (p) {
            const payStatus = (p.paymentStatus as string) || (p.status as string) || '';
            if (payStatus) {
              paymentMap[o.id as number] = {
                id: (p.id as number) ?? 0,
                orderId: o.id as number,
                fileUrl: (p.fileUrl as string) ?? '',
                status: payStatus,
                adminNote: (p.adminNote as string) ?? '',
                createdAt: (p.createdAt as string) ?? '',
                updatedAt: (p.updatedAt as string) ?? '',
              };
            }
          }
        }

        if (Object.keys(paymentMap).length > 0) console.log('Payment map (from orders):', paymentMap);

        // Overlay with payment proof data if available
        await Promise.all(
          mappedBills.map(async (bill) => {
            try {
              const res = await fetch(`${API_URL}/payment/proof/${bill.orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                const json = await res.json();
                const list: PaymentData[] = Array.isArray(json) ? json : (json.data ?? []);
                if (list.length > 0) {
                  paymentMap[bill.orderId] = list[0];
                }
              }
            } catch {
              // no payment proof found
            }
          })
        );
        setPayments(paymentMap);
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

  const handleVerify = async (orderId: number, newStatus: PaymentStatus) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setUpdatingId(orderId);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';
      const res = await fetch(`${API_URL}/payment/verify/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal verifikasi');
      const updated: PaymentData | null = result.data ?? (Array.isArray(result) ? result[0] : null) ?? result;
      if (updated) {
        setPayments((prev) => ({ ...prev, [orderId]: updated }));
      } else {
        setPayments((prev) => ({
          ...prev,
          [orderId]: prev[orderId] ? { ...prev[orderId]!, status: newStatus } : null,
        }));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal memperbarui status pembayaran');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bills.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      String(b.orderId).includes(q) ||
      b.buyerName.toLowerCase().includes(q) ||
      b.buyerEmail.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const pendingPayments = Object.values(payments).filter((p) => p?.status === 'PENDING').length;
  const verifiedCount = Object.values(payments).filter((p) => p?.status === 'VERIFIED').length;

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
          <p className="text-amber-800 font-serif text-lg">Memuat data pembayaran...</p>
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
          <p className="text-gray-500 text-sm mb-8">Terjadi kesalahan saat mengambil data pembayaran.</p>
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
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                <circle cx="12" cy="12" r="5"/>
              </svg>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Kelola Pembayaran
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Verifikasi pembayaran pelanggan TenunKita
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{bills.length}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Pesanan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{formatPrice(totalRevenue)}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Pendapatan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-amber-700">{pendingPayments}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Menunggu Verifikasi</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-emerald-700">{verifiedCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Terverifikasi</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
            <span className="text-sm text-gray-500">
              <strong className="text-[#1a120b]">{filtered.length}</strong> tagihan ditemukan
            </span>
          </div>
          <div className="relative max-w-xs w-full sm:w-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cari tagihan..."
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
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              <circle cx="12" cy="12" r="5"/>
            </svg>
            <p className="text-gray-500 font-serif text-lg">
              {search ? 'Tidak ada tagihan yang cocok' : 'Belum ada tagihan'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-amber-50/80 border-b border-amber-200/40 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Pembeli</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-center">Item</div>
              <div className="col-span-2">Tanggal</div>
              <div className="col-span-2 text-center">Pembayaran</div>
              <div className="col-span-2 text-center">Verifikasi</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-amber-100">
              {filtered.map((bill) => {
                const payment = payments[bill.orderId];
                const payStatus = (payment?.status as PaymentStatus) ?? 'PENDING';
                const cfg = paymentConfig[payStatus] || paymentConfig.PENDING;

                return (
                  <div
                    key={bill.orderId}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors items-center"
                  >
                    {/* Mobile */}
                    <div className="md:hidden flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                        {bill.orderId}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1a120b] text-sm">{bill.buyerName}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{bill.buyerEmail}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-amber-300" />
                          <span className="text-[11px] text-amber-700 font-semibold">{formatPrice(bill.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:flex col-span-1 items-center text-sm text-gray-400 font-medium">
                      #{bill.orderId}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                        {bill.buyerName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-[#1a120b] block truncate">{bill.buyerName}</span>
                        {bill.buyerEmail && (
                          <span className="text-[10px] text-gray-400 truncate block">{bill.buyerEmail}</span>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-end text-sm font-semibold text-[#1a120b]">
                      {formatPrice(bill.totalAmount)}
                    </div>
                    <div className="hidden md:flex col-span-1 items-center justify-center text-sm text-gray-500">
                      {bill.items.length}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center text-sm text-gray-500">
                      {formatDate(bill.createdAt)}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      {payment ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={payStatus}
                            disabled={updatingId === bill.orderId}
                            onChange={(e) => handleVerify(bill.orderId, e.target.value as PaymentStatus)}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-md border cursor-pointer appearance-none text-center
                              ${cfg.color} ${updatingId === bill.orderId ? 'opacity-50' : 'hover:ring-2 hover:ring-amber-400/40'}
                              focus:outline-none transition-all`}
                          >
                            {PAYMENT_STATUS.map((s) => {
                              const c = paymentConfig[s];
                              return (
                                <option key={s} value={s} className="bg-white text-[#1a120b]">
                                  {c.label}
                                </option>
                              );
                            })}
                          </select>
                          {payment.fileUrl && (
                            <a
                              href={payment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:text-amber-600 transition-colors"
                              title="Lihat bukti"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Belum upload</span>
                      )}
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
