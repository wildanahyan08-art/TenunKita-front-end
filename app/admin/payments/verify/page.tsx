'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentProof {
  id: number;
  orderId: number;
  fileUrl: string;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentProofResponse {
  success: boolean;
  message: string;
  data: PaymentProof;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function VerifyPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState<'VERIFIED' | 'REJECTED'>('VERIFIED');
  const [searchOrderId, setSearchOrderId] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (orderId?: string) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Silakan login terlebih dahulu');
      router.push('/sign-in');
      return;
    }

    try {
      if (orderId) {
        const res = await fetch(`${API_URL}/payment/verify/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json: PaymentProofResponse = await res.json();
        if (res.ok && json.success) {
          setPayments([json.data]);
        } else {
          setError(json.message || 'Data tidak ditemukan');
        }
      } else {
        const res = await fetch(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Gagal memuat data');
        const result = await res.json();
        const raw: Record<string, unknown>[] = Array.isArray(result)
          ? result
          : Array.isArray((result as Record<string, unknown>).data)
            ? (result as Record<string, unknown>).data as Record<string, unknown>[]
            : [];

        const proofList: PaymentProof[] = [];
        for (const o of raw) {
          const p = o.payment as Record<string, unknown> | undefined;
          if (p) {
            const status = (p.paymentStatus as string) || (p.status as string) || '';
            if (status === 'PENDING' || !status) continue;
            proofList.push({
              id: (p.id as number) ?? 0,
              orderId: o.id as number,
              fileUrl: (p.fileUrl as string) ?? '',
              status: status,
              adminNote: (p.adminNote as string) ?? '',
              createdAt: (p.createdAt as string) ?? '',
              updatedAt: (p.updatedAt as string) ?? '',
            });
          } else {
            try {
              const proofRes = await fetch(`${API_URL}/payment/proof/${o.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (proofRes.ok) {
                const json = await proofRes.json();
                const list: PaymentProof[] = Array.isArray(json) ? json : (json.data ?? []);
                if (list.length > 0) {
                  proofList.push(list[0]);
                }
              }
            } catch {
              // no payment proof
            }
          }
        }
        setPayments(proofList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments(searchOrderId.trim() || undefined);
  };

  const openVerifyModal = (payment: PaymentProof, actionType: 'VERIFIED' | 'REJECTED') => {
    setSelectedPayment(payment);
    setAction(actionType);
    setAdminNote('');
    setShowModal(true);
  };

  const handleVerify = async () => {
    if (!selectedPayment) return;
    setSubmitting(true);
    setError(null);
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/payment/verify/${selectedPayment.orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: action,
          adminNote: adminNote || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memverifikasi');
      setSuccess(
        action === 'VERIFIED'
          ? `Pembayaran #${selectedPayment.orderId} berhasil diverifikasi`
          : `Pembayaran #${selectedPayment.orderId} ditolak`
      );
      setShowModal(false);
      setSelectedPayment(null);

      const updated: PaymentProof | null = result.data ?? result;
      if (updated) {
        setPayments((prev) =>
          prev.map((p) => (p.orderId === updated.orderId ? updated : p))
        );
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui status');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Menunggu', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    VERIFIED: { label: 'Terverifikasi', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    REJECTED: { label: 'Ditolak', color: 'text-red-700 bg-red-50 border-red-200' },
  };

  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;
  const verifiedCount = payments.filter((p) => p.status === 'VERIFIED').length;
  const rejectedCount = payments.filter((p) => p.status === 'REJECTED').length;

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

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Hero Header */}
      <div className="relative bg-[#1a0f08] overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Verifikasi Pembayaran
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Periksa dan verifikasi bukti pembayaran pelanggan
            </p>
          </div>
        </div>
        <div className="h-6 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-emerald-800 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{payments.length}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Bukti</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-yellow-700">{pendingCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Menunggu</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-emerald-700">{verifiedCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Terverifikasi</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-red-700">{rejectedCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Ditolak</p>
          </div>
        </div>

        {/* Search by Order ID */}
        <div className="bg-white rounded-xl border border-amber-200/40 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="number"
              placeholder="Cari berdasarkan ID Pesanan..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="flex-1 border-0 bg-transparent text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cari
            </button>
            {searchOrderId && (
              <button
                type="button"
                onClick={() => { setSearchOrderId(''); fetchPayments(); }}
                className="px-3 py-2 border border-amber-200 text-sm text-gray-500 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Reset
              </button>
            )}
          </form>
        </div>

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/40 p-12 text-center">
            <p className="text-gray-500 font-serif text-lg">Belum ada bukti pembayaran</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200/40 overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-amber-50/80 border-b border-amber-200/40 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              <div className="col-span-1">ID</div>
              <div className="col-span-2">Pesanan</div>
              <div className="col-span-2">Tanggal</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Bukti</div>
              <div className="col-span-3 text-center">Aksi</div>
            </div>
            <div className="divide-y divide-amber-100">
              {payments.map((payment) => {
                const cfg = statusConfig[payment.status] || statusConfig.PENDING;
                return (
                  <div key={payment.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-amber-50/40 transition-colors items-center"
                  >
                    <div className="md:hidden flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                        {payment.orderId}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1a120b] text-sm">Pesanan #{payment.orderId}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {payment.adminNote && (
                            <span className="text-[10px] text-gray-400 truncate">Catatan: {payment.adminNote}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex col-span-1 items-center text-sm text-gray-400 font-medium">
                      #{payment.id}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center text-sm font-semibold text-[#1a120b]">
                      Pesanan #{payment.orderId}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-center">
                      {payment.fileUrl ? (
                        <a
                          href={payment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-700 hover:text-amber-600 underline text-sm"
                        >
                          Lihat Bukti
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-400">Tidak ada</span>
                      )}
                    </div>
                    <div className="hidden md:flex col-span-3 items-center justify-center gap-2">
                      {payment.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => openVerifyModal(payment, 'VERIFIED')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Verifikasi
                          </button>
                          <button
                            onClick={() => openVerifyModal(payment, 'REJECTED')}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          {payment.status === 'VERIFIED' ? 'Selesai' : 'Ditolak'}
                        </span>
                      )}
                    </div>

                    {/* Mobile actions */}
                    <div className="md:hidden flex items-center gap-2 mt-2">
                      {payment.fileUrl && (
                        <a href={payment.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-amber-700 underline">Lihat Bukti</a>
                      )}
                      {payment.status === 'PENDING' && (
                        <>
                          <button onClick={() => openVerifyModal(payment, 'VERIFIED')}
                            className="ml-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg"
                          >
                            Verifikasi
                          </button>
                          <button onClick={() => openVerifyModal(payment, 'REJECTED')}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg"
                          >
                            Tolak
                          </button>
                        </>
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
          <p className="text-gray-400 text-xs font-medium">TenunKita Admin v1.0</p>
        </div>
      </div>

      {/* Confirm Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-amber-200/40">
            <h3 className="text-lg font-serif font-bold text-[#1a120b] mb-2">
              {action === 'VERIFIED' ? 'Konfirmasi Verifikasi' : 'Tolak Pembayaran'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {action === 'VERIFIED'
                ? `Yakin ingin memverifikasi bukti pembayaran Pesanan #${selectedPayment.orderId}?`
                : `Yakin ingin menolak bukti pembayaran Pesanan #${selectedPayment.orderId}?`}
            </p>

            <div className="bg-amber-50 rounded-xl p-3 mb-4 space-y-1 text-sm">
              <p><span className="text-gray-500">ID:</span> #{selectedPayment.id}</p>
              <p><span className="text-gray-500">Pesanan:</span> #{selectedPayment.orderId}</p>
              {selectedPayment.fileUrl && (
                <p>
                  <a href={selectedPayment.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="text-amber-700 underline">Lihat Bukti</a>
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Catatan Admin (opsional)</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                placeholder={action === 'REJECTED' ? 'Alasan penolakan...' : 'Catatan verifikasi...'}
                className="w-full border border-amber-200/60 rounded-xl p-3 text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-amber-200 rounded-xl text-sm text-gray-600 hover:bg-amber-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleVerify}
                disabled={submitting}
                className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 ${
                  action === 'VERIFIED'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {submitting
                  ? 'Memproses...'
                  : action === 'VERIFIED'
                    ? 'Ya, Verifikasi'
                    : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
