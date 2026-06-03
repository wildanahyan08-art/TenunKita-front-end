'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Image,
  Loader2,
  Download,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { PaymentProofResponse } from '@/lib/api';

const BatikDivider = () => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

function UploadFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<PaymentProofResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReceipt = useCallback(async () => {
    if (!orderId || isDownloading) return;
    setIsDownloading(true);
    try {
      const blob = await api.downloadReceipt(Number(orderId));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal mengunduh struk');
    } finally {
      setIsDownloading(false);
    }
  }, [orderId, isDownloading]);

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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(selected.type)) {
      setError('File harus berupa gambar (JPG/PNG) atau PDF');
      return;
    }

    setError(null);
    setFile(selected);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !orderId) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await api.uploadPaymentProof(Number(orderId), file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  }, [file, orderId]);

  if (!orderId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="font-serif font-bold text-xl text-[#1a120b]">Parameter Tidak Valid</h2>
        <p className="text-gray-500 text-sm mt-2">ID pesanan tidak ditemukan.</p>
        <Link
          href="/customer/orders"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="font-serif font-bold text-xl text-[#1a120b]">Bukti Pembayaran Terunggah</h2>
        <p className="text-gray-500 text-sm mt-2">{result.message}</p>
        <div className="bg-white rounded-2xl border border-amber-200/40 p-5 mt-6 text-left">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">ID Pesanan</span>
              <span className="font-semibold text-[#1a120b]">#{result.data.orderId}</span>
            </div>
            <div className="h-px bg-amber-100" />
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">
                {result.data.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3 bg-amber-800 hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Mengunduh...</>
            ) : (
              <><Download className="w-4 h-4" /> Unduh Struk</>
            )}
          </button>
          <Link
            href="/customer/orders"
            className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md text-center"
          >
            Lihat Pesanan Saya
          </Link>
          <Link
            href="/customer/products"
            className="w-full sm:w-auto px-6 py-3 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-medium transition-all text-center"
          >
            Belanja Lagi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <Link href="/customer/profile" className="hover:text-amber-600 transition-colors">Beranda</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/customer/orders" className="hover:text-amber-600 transition-colors">Pesanan</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-amber-700 font-medium">Upload Pembayaran</span>
      </div>

      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
          <Upload className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Upload Bukti Pembayaran</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pesanan <strong className="text-[#1a120b]">#{orderId}</strong>
        </p>
      </div>

      <BatikDivider />

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="bg-white rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/30">
            <h2 className="font-serif font-bold text-[#1a120b] text-base">Pilih File</h2>
          </div>

          <div className="p-5 space-y-4">
            {/* File input area */}
            <label
              htmlFor="payment-proof"
              className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                preview
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-amber-200 hover:border-amber-400 bg-amber-50/10 hover:bg-amber-50/30'
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Pratinjau bukti pembayaran"
                  className="h-full object-contain p-2"
                />
              ) : file ? (
                <div className="text-center">
                  <FileText className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1a120b]">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Image className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-semibold text-[#1a120b]">
                    Klik untuk upload bukti pembayaran
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, atau PDF (maks. 5MB)
                  </p>
                </div>
              )}
              <input
                id="payment-proof"
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#1a120b]">Informasi</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Pastikan bukti pembayaran jelas dan terbaca. Admin akan memverifikasi pembayaran Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Unggah Bukti Pembayaran
              </>
            )}
          </button>
          
          <Link
            href="/customer/orders"
            className="w-full sm:w-auto px-6 py-3 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-medium transition-all text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function CustomerPaymentPage() {
  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
          </div>
        }>
          <UploadFormContent />
        </Suspense>
        {/* Footer */}
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
