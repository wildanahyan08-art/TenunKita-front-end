'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, BookOpen, Sparkles, Shirt, Palette, Sun, Mountain, Droplet, Wind } from 'lucide-react';

const BatikDivider = () => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
    </svg>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
  </div>
);

const tenunDaerah = [
  {
    daerah: 'Nusa Tenggara Timur',
    nama: 'Tenun Ikat Sumba',
    desc: 'Motif geometris dengan simbol-simbol adat seperti kuda, naga, dan rusa. Setiap warna memiliki makna filosofis tersendiri.',
    image: 'https://images.pexels.com/photos/37038836/pexels-photo-37038836.jpeg',
    warna: 'Merah, Hitam, Cokelat',
  },
  {
    daerah: 'Sumatera Barat',
    nama: 'Songket Minangkabau',
    desc: 'Ditenun dengan benang emas dan perak, melambangkan keagungan adat dan budaya Minang. Digunakan dalam upacara adat.',
    image: 'https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg',
    warna: 'Merah, Emas, Hijau',
  },
  {
    daerah: 'Bali',
    nama: 'Tenun Endek',
    desc: 'Tenun ikat asal Bali dengan motif yang terinspirasi alam, flora, fauna, dan mitologi Hindu. Dipakai dalam keseharian dan upacara.',
    image: 'https://images.pexels.com/photos/37723814/pexels-photo-37723814.jpeg',
    warna: 'Cokelat, Biru, Krem',
  },
  {
    daerah: 'Kalimantan',
    nama: 'Tenun Ulap Doyo',
    desc: 'Tenun khas Dayak dari serat daun doyo yang lembut. Motifnya menggambarkan alam dan kepercayaan leluhur Dayak.',
    image: 'https://images.pexels.com/photos/37038836/pexels-photo-37038836.jpeg',
    warna: 'Cokelat, Putih, Merah',
  },
];

const tahapTenun = [
  {
    icon: Sun,
    title: 'Menyiapkan Benang',
    desc: 'Kapas dipintal menjadi benang, lalu dicelup dengan pewarna alami dari daun, akar, dan kulit kayu.',
  },
  {
    icon: Palette,
    title: 'Mengikat Motif',
    desc: 'Benang diikat dengan tali sesuai pola yang diinginkan, agar warna tidak meresap saat pencelupan.',
  },
  {
    icon: Droplet,
    title: 'Mencelup Warna',
    desc: 'Benang yang sudah diikat dicelup ke pewarna alami. Proses ini bisa diulang untuk mendapatkan gradasi warna.',
  },
  {
    icon: Shirt,
    title: 'Menenun',
    desc: 'Benang lungsin dan pakan dijalin satu per satu menggunakan alat tenun tradisional atau ATBM.',
  },
];

const filosofiMotif = [
  {
    icon: Mountain,
    title: 'Motif Gunung',
    desc: 'Melambangkan kekokohan, keagungan, dan hubungan manusia dengan Sang Pencipta. Motif ini sering ditemukan pada tenun dan batik dari berbagai daerah.',
  },
  {
    icon: Droplet,
    title: 'Motif Air & Ombak',
    desc: 'Menggambarkan kehidupan yang dinamis, kesabaran, dan ketekunan. Ombak juga melambangkan semangat pantang menyerah.',
  },
  {
    icon: Wind,
    title: 'Motif Awan & Angin',
    desc: 'Simbol kebebasan, harapan, dan perjalanan spiritual. Motif ini memberikan kesan ringan dan melambung tinggi.',
  },
  {
    icon: Sun,
    title: 'Motif Matahari',
    desc: 'Matahari sebagai sumber kehidupan. Melambangkan kehangatan, penerangan, dan energi positif dalam setiap helai kain.',
  },
];

const jenisBatik = [
  {
    nama: 'Batik Tulis',
    desc: 'Dibuat dengan canting, prosesnya sangat detail dan memakan waktu berbulan-bulan. Setiap goresan malam (lilin) dikerjakan tangan langsung oleh pengrajin. Nilai seninya paling tinggi.',
    waktu: '1 — 6 bulan',
    icon: Palette,
  },
  {
    nama: 'Batik Cap',
    desc: 'Menggunakan cap tembaga yang dicelupkan ke malam panas lalu ditekankan ke kain. Proses lebih cepat tetapi tetap mempertahankan kualitas motif.',
    waktu: '2 — 7 hari',
    icon: Sparkles,
  },
  {
    nama: 'Batik Printing',
    desc: 'Motif dicetak menggunakan mesin printing tekstil. Paling cepat dan terjangkau, namun tidak memiliki nilai seni yang setinggi batik tulis atau cap.',
    waktu: '1 — 2 hari',
    icon: Shirt,
  },
];

export default function EducationPage() {
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
              <span className="text-amber-500 text-xs font-bold tracking-[0.25em] uppercase">Edukasi Budaya</span>
              <div className="w-12 h-px bg-amber-600/60" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Mengenal{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Warisan Tenun & Batik
              </span>{' '}
              Nusantara
            </h1>
            <p className="text-amber-100/70 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Setiap helai benang dan goresan malam menyimpan cerita, filosofi, dan kearifan lokal
              yang telah diwariskan turun-temurun oleh para leluhur bangsa Indonesia.
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
          <span className="text-amber-700 font-medium">Edukasi Budaya</span>
        </div>

        {/* ─── APA ITU TENUN? ─── */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-amber-200/30 border border-amber-200/40">
              <Image
                src="https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg"
                alt="Proses menenun tradisional"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-amber-600/40" />
                <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Apa Itu Tenun?</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-4 leading-tight">
                Seni Menjalin Benang Menjadi Karya
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Tenun adalah teknik pembuatan kain tradisional Indonesia dengan cara menjalin
                benang lungsin (vertikal) dan benang pakan (horizontal) secara bergantian.
                Teknik ini sudah dikenal sejak ribuan tahun lalu oleh nenek moyang bangsa Indonesia.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Setiap daerah di Indonesia memiliki ciri khas tenun yang berbeda — mulai dari motif,
                warna, hingga bahan baku yang digunakan. Perbedaan ini dipengaruhi oleh alam, adat
                istiadat, dan kepercayaan masyarakat setempat.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                UNESCO telah mengakui batik Indonesia sebagai Warisan Budaya Takbenda pada tahun
                2009, dan saat ini tenun ikat juga tengah dalam proses pengakuan serupa.
              </p>
            </div>
          </div>
        </section>

        <BatikDivider />

        {/* ─── TENUN DARI BERBAGAI DAERAH ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Kekayaan Nusantara</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Tenun dari Berbagai Daerah
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Setiap helai benang menceritakan kekayaan budaya dari Sabang sampai Merauke
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
            {tenunDaerah.map((item) => (
              <div
                key={item.daerah}
                className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-600/50 transition-all duration-300 group"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                  }}
                />
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.nama}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.15em]">{item.daerah}</span>
                    <h3 className="text-white font-serif font-bold text-lg">{item.nama}</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-5 relative z-10">
                  <p className="text-amber-100/60 text-sm leading-relaxed">{item.desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
                    <Palette className="w-3.5 h-3.5" />
                    <span>{item.warna}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BatikDivider />

        {/* ─── PROSES PEMBUATAN TENUN ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Proses</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Proses Pembuatan Tenun Ikat
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Dari benang hingga menjadi kain yang sarat makna
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tahapTenun.map((tahap, index) => (
              <div
                key={tahap.title}
                className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-600/50 transition-all duration-300 text-center group overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: '25px 25px',
                  }}
                />
                <div className="relative mb-4 inline-flex z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 border border-amber-500/30 flex items-center justify-center text-amber-100 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300">
                    <tahap.icon className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {index + 1}
                  </div>
                </div>
                <h3 className="relative z-10 font-serif font-bold text-amber-100 text-sm mb-2">{tahap.title}</h3>
                <p className="relative z-10 text-amber-100/50 text-xs leading-relaxed">{tahap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <BatikDivider />

        {/* ─── MENGENAL BATIK ─── */}
        <section className="py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-amber-200/30 border border-amber-200/40">
                <Image
                  src="https://images.pexels.com/photos/37723814/pexels-photo-37723814.jpeg"
                  alt="Proses membatik"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:order-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-amber-600/40" />
                <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Mengenal Batik</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-4 leading-tight">
                Warisan Budaya yang Diakui Dunia
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Batik adalah teknik menggambar motif pada kain menggunakan malam (lilin) sebagai
                perintang warna. Kata &ldquo;batik&rdquo; berasal dari bahasa Jawa &ldquo;amba&rdquo; (menulis) dan &ldquo;titik&rdquo; (titik).
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Pada 2 Oktober 2009, UNESCO menetapkan batik sebagai Warisan Budaya Takbenda
                Warisan Kemanusiaan. Sejak saat itu, setiap tanggal 2 Oktober diperingati sebagai
                Hari Batik Nasional.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Setiap motif batik memiliki filosofi dan makna mendalam. Misalnya motif Parang
                melambangkan kekuatan dan semangat pantang menyerah, sedangkan motif Kawung
                melambangkan keadilan dan kesucian.
              </p>
            </div>
          </div>

          {/* Jenis batik cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {jenisBatik.map((b) => (
              <div
                key={b.nama}
                className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-5 shadow-sm hover:shadow-md hover:border-amber-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: '25px 25px',
                  }}
                />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mb-3 z-10">
                  <b.icon className="w-5 h-5 text-amber-100" />
                </div>
                <h3 className="relative z-10 font-serif font-bold text-amber-100 text-sm mb-1.5">{b.nama}</h3>
                <p className="relative z-10 text-amber-100/50 text-xs leading-relaxed mb-3">{b.desc}</p>
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] text-amber-400 font-medium bg-amber-800/30 rounded-full px-3 py-1 inline-flex">
                  <BookOpen className="w-3 h-3" />
                  {b.waktu}
                </div>
              </div>
            ))}
          </div>
        </section>

        <BatikDivider />

        {/* ─── FILOSOFI MOTIF ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Filosofi</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Makna di Balik Setiap Motif
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Motif dalam tenun dan batik bukan sekadar hiasan, melainkan sarat akan nilai filosofis
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
            {filosofiMotif.map((m) => (
              <div
                key={m.title}
                className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-600/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px',
                  }}
                />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shrink-0">
                    <m.icon className="w-5 h-5 text-amber-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-amber-100 text-base">{m.title}</h3>
                    <p className="text-amber-100/50 text-sm mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BatikDivider />

        {/* ─── GALERI ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Galeri</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Keindahan dalam Bingkai
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Koleksi foto proses pembuatan dan hasil karya tenun serta batik Nusantara
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Tenun Ikat NTT', 'Batik Tulis Jawa', 'Songket Palembang', 'Tenun Endek Bali'].map((label, i) => (
              <div
                key={label}
                className="relative aspect-square rounded-2xl overflow-hidden bg-amber-200/20 border border-amber-200/40 group cursor-pointer"
              >
                <Image
                  src={`https://images.pexels.com/photos/${[37723814, 10682943, 37038836, 37723814][i]}/pexels-photo-${[37723814, 10682943, 37038836, 37723814][i]}.jpeg`}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-white text-xs font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BatikDivider />

        {/* ─── TIPS MERAWAT ─── */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">tips</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">
              Tips Merawat Kain Tenun & Batik
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Agar keindahan kain tetap terjaga untuk generasi mendatang
            </p>
            <div className="flex items-center gap-2 justify-center mt-4">
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-500/50">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="flex-1 max-w-[100px] h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl border border-amber-700/30 p-6 sm:p-8 shadow-sm overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                backgroundSize: '35px 35px',
              }}
            />
            <ul className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
              {[
                'Cuci dengan air dingin dan gunakan sampo khusus atau lerak alami agar warna tidak luntur.',
                'Jangan direndam terlalu lama. Cukup 5–10 menit lalu bilas dengan air bersih.',
                'Hindari sinar matahari langsung saat menjemur. Cukup diangin-angin di tempat teduh.',
                'Setrika dengan suhu sedang dan setrika dari bagian dalam kain untuk melindungi motif.',
                'Simpan di tempat yang kering, beri kamper atau lavender alami untuk mencegah ngengat.',
                'Jangan dilipat di bagian motif yang sama terus-menerus agar tidak meninggalkan bekas lipatan.',
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-amber-100/60 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-700/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400">
                      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
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
                Mari Lestarikan Budaya Bersama
              </h2>
              <p className="text-amber-100/70 text-sm sm:text-base max-w-lg mx-auto mb-6">
                Dengan mengenal dan mencintai tenun serta batik, kita turut menjaga warisan leluhur
                agar tetap hidup dan dikenal dunia.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/customer/products"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  Jelajahi Koleksi
                </Link>
                <Link
                  href="/about-us"
                  className="px-6 py-3 border border-amber-600/40 text-amber-300 hover:bg-amber-900/30 rounded-xl font-medium transition-all"
                >
                  Tentang Kami
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
