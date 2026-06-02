'use client';

import Link from 'next/link';
import { ChevronRight, Heart, Shield, Leaf, Users, Quote } from 'lucide-react';
import { TeamCarousel } from '@/components/about/TeamCarousel';

const BatikDivider = () => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

const values = [
  {
    icon: Heart,
    title: 'Melestarikan Budaya',
    desc: 'Menjaga dan mempromosikan warisan tenun Nusantara agar tetap hidup di era modern.',
  },
  {
    icon: Users,
    title: 'Pemberdayaan Pengrajin',
    desc: 'Memberikan akses pasar yang lebih luas bagi pengrajin lokal di seluruh Indonesia.',
  },
  {
    icon: Shield,
    title: 'Kualitas Terjamin',
    desc: 'Setiap produk melalui kurasi ketat untuk memastikan keaslian dan kualitas terbaik.',
  },
  {
    icon: Leaf,
    title: 'Keberlanjutan',
    desc: 'Mendukung praktik produksi ramah lingkungan dan ekonomi yang berkelanjutan.',
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#f0e6d4] relative">
      {/* Background batik patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='12' fill='none' stroke='%23b8863c' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
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
              <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Tentang Kami</span>
              <div className="w-12 h-px bg-amber-600/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Menjaga Warisan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Budaya Nusantara
              </span>
            </h1>
            <p className="text-amber-100/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              TenunKita hadir untuk menghubungkan pecinta kain tenun dengan pengrajin berbakat
              dari seluruh penjuru Indonesia, menjembatani tradisi dan teknologi.
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
          <span className="text-amber-700 font-medium">Tentang Kami</span>
        </div>

        {/* ─── CERITA KAMI ─── */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Cerita Kami</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-3">
              Perjalanan TenunKita
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              Berawal dari keprihatinan terhadap mulai terkikisnya minat terhadap kain tenun tradisional
              di tengah gempuran fashion modern.
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-6 sm:p-7 shadow-sm overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-4 relative z-10 shadow-sm">
                <Quote className="w-5 h-5 text-amber-100" />
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed relative z-10">
                TenunKita didirikan pada tahun 2024 dengan visi menjadi jembatan antara pengrajin
                tenun tradisional Indonesia dan pasar global. Kami percaya bahwa setiap helai benang
                tenun menyimpan cerita, nilai budaya, dan kearifan lokal yang patut dilestarikan.
              </p>
            </div>
            <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-6 sm:p-7 shadow-sm overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-4 relative z-10 shadow-sm">
                <Quote className="w-5 h-5 text-amber-100" />
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed relative z-10">
                Melalui platform ini, kami tidak hanya menjual produk, tetapi juga memperkenalkan
                kekayaan motif tenun dari berbagai daerah, mendukung ekonomi kreatif, dan
                memberdayakan komunitas pengrajin di seluruh Nusantara.
              </p>
            </div>
          </div>
        </section>

        <BatikDivider />

        {/* ─── ORANG DI BALIK TENUNKITA ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Tim</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Orang di Balik TenunKita
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Dua individu visioner yang menjadi penggerak utama di balik platform ini
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <TeamCarousel />
        </section>

        <BatikDivider />

        {/* ─── NILAI KAMI ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Nilai</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Nilai-Nilai Kami
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Prinsip yang menjadi fondasi setiap langkah TenunKita
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((item) => (
              <div
                key={item.title}
                className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-600/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                  }}
                />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon className="w-5 h-5 text-amber-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-100 text-base">{item.title}</h3>
                    <p className="text-amber-100/60 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mb-8">
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
                Bergabung dengan Gerakan TenunKita
              </h2>
              <p className="text-amber-100/70 text-sm sm:text-base max-w-lg mx-auto mb-6">
                Mari bersama-sama melestarikan warisan budaya bangsa melalui setiap helai kain tenun
                yang kita cintai.
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
          <BatikDivider />
          <p className="text-gray-400 text-[11px] mt-4 tracking-wider">
            TenunKita — Warisan Budaya Nusantara
          </p>
        </div>
      </div>
    </div>
  );
}
