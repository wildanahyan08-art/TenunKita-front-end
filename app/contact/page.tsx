'use client';

import Link from 'next/link';
import { ChevronRight, Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BatikBorder } from '@/components/ui/BatikBorder';

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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#faf6f0]">
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#faf6f0] to-transparent" />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ─── BREADCRUMB ─── */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-amber-700 font-medium">Kontak</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ─── CONTACT FORM ─── */}
          <div className="lg:col-span-3">
            <SectionHeading label="Kirim Pesan" title="Ada yang bisa kami bantu?" subtitle="Isi form di bawah ini dan tim kami akan merespon secepatnya." />

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#1a120b] uppercase tracking-[0.1em] mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a120b] uppercase tracking-[0.1em] mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="w-full px-4 py-3 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a120b] uppercase tracking-[0.1em] mb-1.5">Subjek</label>
                <input
                  type="text"
                  placeholder="Masukkan subjek pesan"
                  className="w-full px-4 py-3 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a120b] uppercase tracking-[0.1em] mb-1.5">Pesan</label>
                <textarea
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full px-4 py-3 bg-white border border-amber-200/60 rounded-xl text-sm text-[#1a120b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all resize-none"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" /> Kirim Pesan
              </button>
            </form>
          </div>

          {/* ─── CONTACT INFO ─── */}
          <div className="lg:col-span-2">
            <SectionHeading label="Informasi" title="Kontak Kami" />

            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const Card = item.href ? 'a' : 'div';
                return (
                  <Card
                    key={item.title}
                    {...(item.href ? { href: item.href } : {})}
                    className={`bg-white rounded-2xl border border-amber-200/40 p-5 hover:shadow-md hover:border-amber-300/60 transition-all duration-300 ${
                      item.href ? 'block no-underline cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-[#1a120b] text-sm">{item.title}</h3>
                        <p className="text-gray-500 text-sm mt-0.5 whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* ─── SOCIAL ─── */}
            <div className="mt-6 bg-white rounded-2xl border border-amber-200/40 p-5">
              <h3 className="font-serif font-bold text-[#1a120b] text-sm mb-3">Ikuti Kami</h3>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'TikTok', 'YouTube'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-700 hover:from-amber-100 hover:to-amber-200 hover:scale-105 transition-all duration-300 text-[10px] font-bold uppercase tracking-tight"
                  >
                    {platform.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BatikBorder />

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
          <BatikBorder />
          <p className="text-gray-400 text-[11px] mt-4 tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
        </div>
      </div>
    </div>
  );
}
