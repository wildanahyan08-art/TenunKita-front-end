'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from 'react-icons/fa6';
import { ChevronRight, Mail, MapPin, Phone, Send, Clock, Camera, Globe, Music2, Play, CheckCircle, Loader2 } from 'lucide-react';

export interface Root {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const contactInfo = [
  {
    icon: MapPin,
    title: 'Alamat',
    content: 'Jl. Danau Ranau, Kelurahan Kedungkandang, Kecamatan Sawojajar, Kota Malang, Jawa Timur 57100',
  },
  {
    icon: Phone,
    title: 'Telepon',
    content: '+62 812-3456-7890',
    href: 'tel:+6281234567890',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'info@tenunkita.id',
    href: 'mailto:info@tenunkita.id',
  },
  {
    icon: Clock,
    title: 'Jam Operasional',
    content: 'Senin - Jumat: 08.00 - 17.00 WIB\nSabtu: 08.00 - 14.00 WIB',
  },
];

const socials = [
  { icon: FaInstagram, label: 'Instagram', color: 'hover:bg-pink-600', url: 'https://instagram.com/tenunkita' },
  { icon: FaFacebook, label: 'Facebook', color: 'hover:bg-blue-600', url: 'https://facebook.com/tenunkita' },
  { icon: FaTiktok, label: 'TikTok', color: 'hover:bg-black', url: 'https://tiktok.com/@tenunkita' },
  { icon: FaYoutube, label: 'YouTube', color: 'hover:bg-red-600', url: 'https://youtube.com/@tenunkita' },
];

export default function ContactPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.role === 'BUYER') {
          setIsLoggedIn(true);
          setUserName(parsed.name || '');
          setUserEmail(parsed.email || '');
          setForm((prev) => ({ ...prev, name: parsed.name || '', email: parsed.email || '' }));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/sign-in');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim pesan');

      setSuccess(true);
      setForm({ name: userName, email: userEmail, phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0e6d4]">
      {/* Background batik patterns */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23b8863c'/%3E%3C/svg%3E")`,
          backgroundSize: '70px 70px',
        }}
      />
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a120b] via-[#2a1a0e] to-[#1a0f08]">
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L37.5 22.5L60 30L37.5 37.5L30 60L22.5 37.5L0 30L22.5 22.5Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-amber-600/60" />
              <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Kontak</span>
              <div className="w-12 h-px bg-amber-600/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Hubungi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                TenunKita
              </span>
            </h1>
            <p className="text-amber-100/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Punya pertanyaan, saran, atau ingin bekerja sama? Kami siap mendengar dari Anda.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f0e6d4] to-transparent" />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium">Kontak</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* ─── LEFT: FORM ─── */}
          <div className="lg:col-span-3">
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-3xl border border-amber-700/30 p-6 sm:p-8 shadow-xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '35px 35px',
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-px bg-amber-600/40" />
                  <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Kirim Pesan</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-100 mb-1">Ada yang bisa kami bantu?</h2>
                <p className="text-amber-100/50 text-sm mb-6">Isi form di bawah ini dan tim kami akan merespon secepatnya.</p>

                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-amber-100 mb-1">Pesan Terkirim!</h3>
                    <p className="text-amber-100/50 text-sm">Terima kasih, tim kami akan menghubungi Anda segera.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-5 px-5 py-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-all"
                    >
                      Kirim Pesan Lagi
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLoggedIn && (
                      <div className="p-4 rounded-xl bg-amber-800/30 border border-amber-700/40 text-amber-200 text-sm">
                        Silakan{' '}
                        <Link href="/sign-in" className="text-amber-400 font-semibold underline hover:text-amber-300 transition-colors">
                          masuk
                        </Link>{' '}
                        terlebih dahulu untuk mengirim pesan.
                      </div>
                    )}

                    {error && (
                      <div className="p-3 rounded-xl bg-red-900/30 border border-red-800/40 text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-amber-400 uppercase tracking-[0.1em] mb-1.5">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Masukkan nama Anda"
                          className="w-full px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-400 uppercase tracking-[0.1em] mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="Masukkan email Anda"
                          className="w-full px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-[0.1em] mb-1.5">Telepon</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Masukkan nomor telepon Anda"
                        className="w-full px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-400 uppercase tracking-[0.1em] mb-1.5">Pesan</label>
                      <textarea
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tulis pesan Anda di sini..."
                        className="w-full px-4 py-3 bg-amber-900/20 border border-amber-700/40 rounded-xl text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/50 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending || !isLoggedIn}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 disabled:bg-amber-800 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                      {isSending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Kirim Pesan</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: CONTACT INFO ─── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-3xl border border-amber-700/30 p-6 sm:p-7 shadow-xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-amber-600/40" />
                  <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Informasi</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-amber-100 mb-5">Kontak Kami</h2>

                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const Card = item.href ? 'a' : 'div';
                    return (
                      <Card
                        key={item.title}
                        {...(item.href ? { href: item.href } : {})}
                        className={`flex items-start gap-4 p-4 rounded-2xl bg-amber-900/20 border border-amber-700/30 hover:bg-amber-800/30 hover:border-amber-600/50 transition-all duration-300 ${item.href ? 'block no-underline cursor-pointer' : ''
                          }`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                          <Icon className="w-5 h-5 text-amber-100" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-amber-100 text-sm">{item.title}</h3>
                          <p className="text-amber-100/50 text-sm mt-0.5 whitespace-pre-line">{item.content}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── SOCIAL ─── */}
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-3xl border border-amber-700/30 p-6 sm:p-7 shadow-xl overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '25px 25px',
                }}
              />
              <div className="relative z-10">
                <h3 className="font-serif font-bold text-amber-100 text-sm mb-3">Ikuti Kami</h3>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-xl bg-amber-700/40 border border-amber-600/30 flex items-center justify-center text-amber-300 ${s.color} hover:border-transparent hover:text-white hover:scale-105 transition-all duration-300`}
                      title={s.label}
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── BATIK DIVIDER ─── */}
        <div className="flex items-center gap-3 my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-600/60 shrink-0">
            <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
        </div>

        {/* ─── CTA ─── */}
        <section className="mt-16 mb-8">
          <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1a0e] to-[#1a0f08] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0L31.25 18.75L50 25L31.25 31.25L25 50L18.75 31.25L0 25L18.75 18.75Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                Ingin Bekerja Sama?
              </h2>
              <p className="text-amber-100/70 text-sm sm:text-base max-w-lg mx-auto mb-6">
                Kami terbuka untuk kolaborasi dengan pengrajin, desainer, dan mitra bisnis
                yang memiliki visi yang sama dalam melestarikan tenun Nusantara.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/sign-up"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  href="/customer/products"
                  className="px-6 py-3 border border-amber-600/40 text-amber-300 hover:bg-amber-900/30 rounded-xl font-medium transition-all"
                >
                  Jelajahi Produk
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <div className="mt-8 text-center">
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-600/60 shrink-0">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
            </svg>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
          </div>
          <p className="text-gray-400 text-[11px] mt-4 tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
        </div>
      </div>
    </div>
  );
}
