'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Truck,
  Ticket,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import type { CartItemData, ProductItem } from "@/lib/api";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

interface PromoResponse {
  message: string;
  orderId: number;
  subtotal: number;
  discountAmount: number;
  promoCode: string;
  totalAmount: number;
  status: string;
  instruction: string;
}

export default function CustomerCartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [recommended, setRecommended] = useState<ProductItem[]>([]);

  // Promo states
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/sign-in");
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role === "ADMIN") {
        router.push("/admin/profile");
        return;
      }
    } catch {
      router.push("/sign-in");
    }
  }, [router]);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.getCart();
      const raw = res as {
        data?: { items: CartItemData[] };
        items?: CartItemData[];
      };
      const data = raw.data?.items ?? raw.items ?? [];
      setItems(data);
      setError(null);
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
      setError("Gagal memuat keranjang");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    api
      .getProducts()
      .then((res) => {
        const all = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
            ? res.data
            : [];
        const shuffled = all.sort(() => 0.5 - Math.random());
        setRecommended(shuffled.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await api.addToCart(productId);
      fetchCart();
    } catch {
      alert("Gagal menambahkan ke keranjang.");
    }
  };

  const handleUpdateQty = async (cartId: number, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(cartId);
    try {
      await api.updateCartItem(cartId, newQty);
      setItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQty } : item,
        ),
      );
      // Reset applied promo when cart changes
      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoCode("");
      }
    } catch {
      setError("Gagal memperbarui jumlah");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (cartId: number) => {
    setUpdatingId(cartId);
    try {
      await api.removeCartItem(cartId);
      setItems((prev) => prev.filter((item) => item.id !== cartId));
      // Reset applied promo when cart changes
      if (appliedPromo) {
        setAppliedPromo(null);
        setPromoCode("");
      }
    } catch {
      setError("Gagal menghapus item");
    } finally {
      setUpdatingId(null);
    }
  };

  // Fungsi untuk apply promo - hanya menyimpan kode, tidak memanggil API
  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError("Masukkan kode promo");
      return;
    }

    // Simpan kode promo tanpa validasi backend
    // Validasi akan dilakukan saat checkout
    setAppliedPromo({
      code: promoCode.toUpperCase(),
      discountAmount: 0, // Akan dihitung dari response checkout nanti
    });
    setPromoError(null);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError(null);
  };

  const handleCheckout = async () => {
  if (items.length === 0) {
    setError("Keranjang Anda kosong. Tambahkan produk terlebih dahulu.");
    return;
  }

  setIsCheckingOut(true);
  setError(null);

  const token = localStorage.getItem("access_token");
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://tenunkita-production.up.railway.app";

  try {
    const response = await fetch(`${API_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        promoCode: appliedPromo?.code || null,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message && data.message.toLowerCase().includes("promo")) {
        setAppliedPromo(null);
        setPromoCode("");
        setPromoError(data.message);
        setIsCheckingOut(false);
        return;
      }
      throw new Error(data.message || "Gagal melakukan checkout");
    }

    // Redirect ke halaman success payments
    router.push(`/customer/payments/success?orderId=${data.orderId}`);
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Terjadi kesalahan saat checkout";
    setError(errorMsg);
    console.error("Checkout error:", err);
    setIsCheckingOut(false);
  }
};

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = appliedPromo?.discountAmount || 0;
  const totalAmount = subtotal - discountAmount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-xl animate-pulse" />
            <div
              className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-xl animate-pulse"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-xl animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="absolute inset-6 border-2 border-amber-600/60 rounded-lg animate-pulse"
              style={{ animationDelay: "0.3s" }}
            />
            <div className="absolute inset-8 border border-amber-600/40 rounded" />
          </div>
          <p className="text-amber-800 font-serif text-lg">
            Memuat keranjang belanja...
          </p>
          <div className="w-48 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* ─── HERO HEADER ─── */}
      <div className="relative bg-[#1a0f08] overflow-hidden -mt-[95px]">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pt-[95px] sm:pt-[95px]">
          <div className="flex items-center gap-2 text-xs mb-4">
            <Link
              href="/dashboard"
              className="text-amber-400/60 hover:text-amber-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3 text-amber-600/40" />
            <Link
              href="/customer/products"
              className="text-amber-400/60 hover:text-amber-300 transition-colors"
            >
              Produk
            </Link>
            <ChevronRight className="w-3 h-3 text-amber-600/40" />
            <span className="text-amber-300 font-medium">Keranjang</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
              <ShoppingCart className="w-5 h-5 text-amber-600/70" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Keranjang Belanja
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              {totalItems > 0
                ? `${totalItems} item dalam keranjang Anda`
                : "Keranjang Anda kosong"}
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
              <div className="w-2 h-2 bg-amber-600/50 rotate-45" />
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
            </div>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        {/* ─── ERROR ─── */}
        {error && (
          <div className="mb-5 px-5 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600 font-medium"
            >
              Tutup
            </button>
          </div>
        )}

        {items.length === 0 ? (
          /* ─── EMPTY STATE ─── */
          <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-300/50 shadow-sm p-16 text-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute top-6 right-6 w-16 h-16 border border-amber-300/20 rotate-45 rounded-xl" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border border-amber-300/20 rotate-12 rounded-xl" />
            <div className="w-20 h-20 mx-auto mb-5 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200/60">
              <ShoppingBag className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="font-serif font-bold text-xl text-[#1a120b] mb-1">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Belum ada produk di keranjang. Yuk, mulai belanja kain tenun
              Nusantara!
            </p>
            <Link
              href="/customer/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" /> Mulai Belanja
            </Link>
          </div>
        ) : (
          <>
            {/* ─── CART HEADER ─── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6 sm:mt-10 mb-2 pb-6 border-b border-amber-200/40">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1a120b]">
                  Daftar Belanja
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {totalItems} item unik dalam keranjang Anda
                </p>
              </div>
              <Link
                href="/customer/products"
                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-600 font-medium text-sm transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                Lanjut Belanja Produk Lainnya
              </Link>
            </div>

            {/* ─── CART CONTENT ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Cart Items */}
              <div className="lg:col-span-7 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`relative bg-gradient-to-br from-amber-50/80 to-white rounded-2xl border border-amber-300/50 shadow-sm overflow-hidden transition-all duration-300 group ${
                      updatingId === item.id ? "opacity-60" : "hover:shadow-lg"
                    }`}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="flex flex-col sm:flex-row gap-6 p-5">
                      {/* Image */}
                      <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shrink-0 border border-amber-100">
                        {item.product.imageUrl ? (
                          <>
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f08]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-300">
                            <ShoppingBag className="w-10 h-10" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-amber-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-sm">
                          {item.product.category?.name || "Produk"}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif font-bold text-lg text-[#1a120b] leading-snug">
                              {item.product.name}
                            </h3>
                            <p className="text-amber-600 font-bold text-xs mt-0.5 tracking-[0.15em] uppercase">
                              {item.product.category?.name || ""}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={updatingId === item.id}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 shrink-0"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.product.description && (
                          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 italic border-l-2 border-amber-300/30 pl-3">
                            {item.product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-amber-50 border border-amber-200/60 rounded-xl p-1">
                            <button
                              onClick={() =>
                                handleUpdateQty(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || updatingId === item.id
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-700 hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-[#1a120b]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQty(item.id, item.quantity + 1)
                              }
                              disabled={updatingId === item.id}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-700 hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-700 font-bold text-xl font-serif">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT: Order Summary */}
              <div className="lg:col-span-5 lg:sticky lg:top-6">
                <div className="bg-[#1a0f08] text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  <h3 className="font-serif text-2xl font-bold mb-6 border-b border-white/10 pb-4 relative z-10">
                    Ringkasan Pesanan
                  </h3>

                  <div className="space-y-4 mb-6 relative z-10">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-white/70"
                      >
                        <span className="truncate max-w-[200px]">
                          {item.product.name}{" "}
                          <span className="text-white/40">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-white shrink-0 ml-2">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-3">
                    <span className="text-white/60 text-sm">Subtotal</span>
                    <span className="text-white font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Discount - Show after checkout (will be updated when checkout response comes) */}
                  {/* Note: Discount amount will be shown in checkout success page */}

                  {/* Total */}
                  <div className="pt-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-base font-bold uppercase tracking-wider text-amber-400">
                        Total Tagihan
                      </span>
                      <span className="font-serif text-2xl font-bold text-amber-100">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 italic mt-1">
                      *Termasuk PPN dan jaminan keaslian sertifikat.
                    </p>
                  </div>

                  {/* Promo Input - Only for entering code, not validating */}
                  <div className="mb-6 relative z-10">
                    {!appliedPromo ? (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Masukkan kode promo"
                            value={promoCode}
                            onChange={(e) =>
                              setPromoCode(e.target.value.toUpperCase())
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-white/30 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim()}
                            className="absolute right-1.5 top-1.5 bg-amber-600 text-white text-[10px] px-3.5 py-1.5 rounded-lg font-bold hover:bg-amber-500 transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {promoError}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="bg-amber-600/20 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-amber-400" />
                          <div>
                            <p className="text-xs font-bold text-amber-400">
                              {appliedPromo.code}
                            </p>
                            <p className="text-[10px] text-white/50">
                              Kode promo akan berlaku saat checkout
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-white/50 hover:text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isCheckingOut}
                    className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800/50 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg font-bold disabled:cursor-not-allowed relative z-10"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span className="tracking-wider uppercase">
                          Lanjutkan Pembayaran
                        </span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Payment Icons */}
                  <div className="mt-6 flex items-center justify-center gap-4 opacity-30 relative z-10">
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
                      Visa
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
                      MC
                    </span>
                    <span className="text-white/40">|</span>
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">
                      BCA
                    </span>
                  </div>
                </div>

                {/* Info badges */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-amber-50/80 to-white rounded-xl border border-amber-300/50 shadow-sm">
                    <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#1a120b]">
                        Gratis Ongkir
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Min. belanja Rp150rb
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-amber-50/80 to-white rounded-xl border border-amber-300/50 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-[#1a120b]">
                        Produk Asli
                      </p>
                      <p className="text-[10px] text-gray-400">Garansi 100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── RECOMMENDED PRODUCTS ─── */}
        {recommended.length > 0 && (
          <section className="mt-16 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-amber-600 font-bold text-xs tracking-[0.3em] uppercase mb-2">
                  Kurasi Terbaik
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a120b]">
                  Rekomendasi Untuk Anda
                </h2>
              </div>
              <Link
                href="/customer/products"
                className="text-amber-700 font-semibold text-sm border-b-2 border-amber-300/40 hover:border-amber-600 transition-all pb-1 uppercase tracking-wider"
              >
                Lihat Koleksi Lengkap
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {recommended.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link href={`/customer/products/${product.id}`}>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50/80 to-white mb-3 shadow-sm border border-amber-300/50 hover:shadow-lg transition-all duration-300">
                      <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                          backgroundSize: "25px 25px",
                        }}
                      />
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                          <ShoppingBag className="w-10 h-10 text-amber-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#1a0f08]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          className="w-full bg-white text-[#1a120b] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl cursor-pointer hover:bg-amber-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Ke Keranjang
                        </div>
                      </div>
                    </div>
                  </Link>
                  <h4 className="font-serif font-bold text-[#1a120b] text-sm px-1 leading-snug line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-amber-700 font-bold text-sm mt-0.5 px-1">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-amber-300/40" />
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="text-amber-400/40"
            >
              <path
                d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                fill="currentColor"
              />
            </svg>
            <div className="w-12 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
          <p className="text-gray-400/60 text-[11px] mt-1">
            &copy; {new Date().getFullYear()} TenunKita. All rights reserved.
          </p>
        </div>
      </div>

      {/* ─── FLOATING CHAT ─── */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-[#1a0f08] text-amber-500 rounded-full flex items-center justify-center shadow-2xl border border-amber-700/30 hover:bg-amber-800 transition-all hover:scale-110 active:scale-95">
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}