// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ArrowRight, Users, Star, Store } from "lucide-react";
import { motion } from "motion/react";

const BatikDivider = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="text-amber-600/60 shrink-0"
    >
      <path
        d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
        fill="currentColor"
      />
    </svg>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
  </div>
);

const BatikStar = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
  </svg>
);

const heroSlides = [
  {
    title: "Bangga Pakai Tenun Indonesia",
    subtitle:
      "Setiap helai benang mengandung doa, cerita, dan jiwa pengrajin Nusantara yang telah mewarisi tradisi ribuan tahun.",
    image:
      "https://images.pexels.com/photos/37723814/pexels-photo-37723814.jpeg",
    cta: "Mulai Belanja",
    ctaSecondary: "Pelajari Budaya",
    link: "/sign-up",
    linkSecondary: "/artikel",
    badge: "Warisan Nusantara",
  },
  {
    title: "Warisan Luhur untuk Gaya Hidup Modern",
    subtitle:
      "Temukan keindahan produk budaya Nusantara yang memadukan tradisi dan estetika kontemporer.",
    image:
      "https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg",
    cta: "Daftar Sekarang",
    ctaSecondary: "Tentang Kami",
    link: "/sign-up",
    linkSecondary: "/about-us",
    badge: "Budaya Indonesia",
  },
  {
    title: "Pesona Tenun dari Timur Indonesia",
    subtitle:
      "Jelajahi kekayaan motif tenun dari Sabang sampai Merauke, setiap daerah memiliki keunikan dan cerita tersendiri.",
    image:
      "https://images.pexels.com/photos/37038836/pexels-photo-37038836.jpeg",
    cta: "Jelajahi Koleksi",
    ctaSecondary: "Lihat Produk",
    link: "/produk",
    linkSecondary: "/produk",
    badge: "Kekayaan Nusantara",
  },
];

const features = [
  {
    icon: <Store className="w-6 h-6" />,
    title: "Produk Autentik",
    desc: "Langsung dari pengrajin bersertifikat di seluruh Nusantara",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-400/30",
    glow: "shadow-amber-200/50",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Warisan Budaya",
    desc: "Setiap produk memiliki cerita dan filosofi yang mendalam",
    color: "from-amber-600/20 to-amber-700/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-300/50",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Dukung Pengrajin",
    desc: "Membantu melestarikan seni tradisional Indonesia",
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-400/30",
    glow: "shadow-amber-200/50",
  },
];

const stats = [
  { num: 500, suffix: "+", label: "Pengrajin Lokal" },
  { num: 5000, suffix: "+", label: "Produk Tenun" },
  { num: 50, suffix: "rb+", label: "Pelanggan Puas" },
  { num: 34, suffix: "", label: "Provinsi Asal" },
];

const testimonials = [
  {
    text: "Kain tenunnya luar biasa berkualitas! Motifnya detail dan warnanya sesuai foto. Saya dapat banyak pujian waktu pakai di acara nikahan.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sari Dewi",
    role: "Pelanggan Setia",
  },
  {
    text: "Proses belanjanya mudah banget. Pengirimannya cepat dan packingnya rapi banget. Pasti bakal order lagi buat koleksi berikutnya!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Budi Santoso",
    role: "Kolektor Kain",
  },
  {
    text: "Seneng banget nemuin platform yang jual tenun asli. Harganya worth it dengan kualitasnya. TenunKita beneran melestarikan budaya!",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Maya Putri",
    role: "Desainer",
  },
  {
    text: "Saya pesan songket buat acara keluarga, hasilnya memuaskan. Detailnya rapi dan bahannya nyaman dipakai. Recommended banget!",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Hendra Wijaya",
    role: "Pengusaha",
  },
  {
    text: "Pelayanannya ramah banget. Admin fast response dan bantu pilihkan motif yang cocok. Pengalaman belanja yang menyenangkan!",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Rina Amelia",
    role: "Ibu Rumah Tangga",
  },
  {
    text: "Tenun dari TenunKita beda sama yang lain. Motifnya unik dan nggak pasaran. Bikin penampilan makin berkelas. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "Dimas Pratama",
    role: "Fashion Enthusiast",
  },
  {
    text: "Kualitas premium dengan harga terjangkau. Pengiriman sampai ke luar pulau pun cepat. Terima kasih TenunKita sudah mengenalkan tenun Nusantara!",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Lestari Ningsih",
    role: "Guru",
  },
  {
    text: "Saya beli batik tulis untuk koleksi pribadi. Motifnya detail banget, ciri khas batik tulis masih terjaga. Puas sekali dengan pembelian ini!",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    name: "Agus Firmansyah",
    role: "PNS",
  },
  {
    text: "Rekomendasi dari teman ternyata beneran bagus. Kain tenunnya adem dipakai, cocok buat cuaca tropis. Akan jadi langganan tetap!",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    name: "Dewi Sartika",
    role: "Dosen",
  },
];

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-6 rounded-2xl border border-amber-200/40 shadow-lg shadow-amber-900/5 max-w-xs w-full bg-[#faf6f0]"
                key={i}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-500"
                    >
                      <path
                        d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                        fill="currentColor"
                      />
                    </svg>
                  ))}
                </div>
                <div className="text-gray-600 text-sm leading-relaxed">
                  &ldquo;{text}&rdquo;
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    width={36}
                    height={36}
                    src={image}
                    alt={name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-[#1a120b] text-sm leading-tight">
                      {name}
                    </div>
                    <div className="text-xs text-gray-400 leading-tight">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-[#f5efe8] via-[#faf6f0] to-[#f5efe8] min-h-screen relative">
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
      <section className="relative h-[500px] md:h-[760px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover object-center scale-105"
              sizes="100vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />

            {/* Batik overlay */}
            <div
              className="absolute inset-0 z-10 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: "80px 80px",
              }}
            />

            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-5">
              <span className="inline-flex items-center gap-2 bg-amber-600/80 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6 border border-amber-400/30">
                <BatikStar className="w-3 h-3 text-amber-200" />
                {slide.badge}
                <BatikStar className="w-3 h-3 text-amber-200" />
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white font-serif leading-tight max-w-6xl mb-6 drop-shadow-2xl">
                {slide.title}
              </h1>
              <div className="w-16 h-px bg-amber-500/60 mb-6" />
              <p className="text-amber-100/80 text-sm md:text-lg max-w-4xl mb-2 leading-relaxed">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 ${idx === currentSlide ? "bg-amber-400 w-10 h-2 rounded-full" : "bg-white/30 w-2 h-2 rounded-full hover:bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="relative bg-[#1a0f08] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-amber-400 font-serif">
                  <NumberTicker value={s.num} />
                  {s.suffix}
                </p>
                <p className="text-amber-100/50 text-xs font-medium uppercase tracking-[0.15em] mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-5 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-16 md:py-20 bg-[#faf6f0] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-px bg-amber-600/40" />
                <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">
                  Keunggulan
                </span>
                <div className="w-12 h-px bg-amber-600/40" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a120b]">
                Mengapa TenunKita?
              </h2>
              <BatikDivider />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative"
              >
                <div className="relative bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] rounded-2xl p-7 text-center border border-amber-700/30 h-full overflow-hidden transition-all duration-500 hover:border-amber-600/50 hover:shadow-xl hover:-translate-y-2">
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                      backgroundSize: '35px 35px',
                    }}
                  />

                  {/* Hover top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 relative z-10" />

                  {/* Corner decorations */}
                  <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-500/60"
                    >
                      <path
                        d="M0 0L4 2L8 0L12 2L16 0V4L14 8L16 12L14 16H12L8 14L4 16H0V12L2 8L0 4V0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-90 z-10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-500/60"
                    >
                      <path
                        d="M0 0L4 2L8 0L12 2L16 0V4L14 8L16 12L14 16H12L8 14L4 16H0V12L2 8L0 4V0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  {/* Icon */}
                  <div className="relative w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 border-2 border-amber-500/30 flex items-center justify-center text-amber-100 shadow-sm group-hover:shadow-lg group-hover:scale-110 group-hover:border-amber-400/50 transition-all duration-400 z-10">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-400/20 group-hover:to-amber-500/10 transition-all duration-500" />
                    <span className="relative z-10 group-hover:rotate-[-8deg] transition-transform duration-400">
                      {item.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="relative z-10 font-serif font-bold text-amber-100 text-lg mb-2.5 group-hover:text-amber-200 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="relative z-10 text-amber-100/60 text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bottom decoration */}
                  <div className="relative z-10 mt-5 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-8 h-px bg-amber-500/40" />
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-500/60"
                    >
                      <path
                        d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="w-8 h-px bg-amber-500/40" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANIMATED TAGLINE ─── */}
      <section className="relative py-14 md:py-18 bg-[#1a0f08] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative container mx-auto px-6 text-center">
          <TextGenerateEffect
            words="Setiap helai benang menyimpan doa, cerita, dan jiwa pengrajin Nusantara yang telah mewarisi tradisi ribuan tahun. TenunKita hadir untuk merawat warisan budaya Indonesia."
            className="text-lg md:text-2xl lg:text-3xl max-w-4xl mx-auto text-white font-serif"
            duration={0.4}
          />
          <div className="mt-6 flex items-center justify-center gap-3 opacity-30">
            <div className="w-16 h-px bg-amber-500/50" />
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              className="text-amber-500/50"
            >
              <path
                d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                fill="currentColor"
              />
            </svg>
            <div className="w-16 h-px bg-amber-500/50" />
          </div>
        </div>
      </section>

      {/* ─── SERTIFIKAT ─── */}
      <section className="py-16 md:py-20 bg-white border-t border-amber-200/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">
                Sertifikat
              </span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a120b]">
              Sertifikat Keaslian Produk
            </h2>
            <BatikDivider />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
            <div className="w-full md:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-br from-amber-200/60 via-amber-100/40 to-amber-200/60 rounded-2xl blur-sm group-hover:blur transition-all duration-500" />
                <div className="relative overflow-hidden rounded-xl border border-amber-700/30 bg-gradient-to-br from-[#1a0f08] to-[#2d1a0e] shadow-lg">
                  <Image
                    src="/sertifikat.png"
                    alt="Sertifikat Keaslian TenunKita"
                    width={600}
                    height={800}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-700/30 border border-amber-600/40 rounded-full">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-amber-600 shrink-0"
                >
                  <path
                    d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-[10px] font-semibold text-amber-700 tracking-wider uppercase">
                  Garansi Autentik
                </span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1a120b]">
                Jaminan Produk Orisinil
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Setiap produk yang dibeli di TenunKita dilengkapi dengan
                sertifikat keaslian resmi dari pengrajin. Sertifikat ini
                menjamin bahwa kain yang Anda terima adalah hasil karya asli
                buatan tangan pengrajin berbakat Nusantara, bukan produksi mesin
                massal.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  {
                    label: "Pengrajin Bersertifikat",
                    sub: "Terdaftar & terverifikasi",
                  },
                  { label: "Bahan Premium", sub: "Serat alami berkualitas" },
                  { label: "Tenun Tangan Asli", sub: "100% buatan tangan" },
                  { label: "Desain Eksklusif", sub: "Motif khas daerah" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-amber-600 mt-0.5 shrink-0"
                    >
                      <path
                        d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div>
                      <p className="text-[#1a120b] text-sm font-semibold leading-tight">
                        {item.label}
                      </p>
                      <p className="text-gray-400 text-[11px]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-16 md:py-20 bg-[#f0e6d4] border-t border-amber-200/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">
                Koleksi
              </span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a120b]">
              Jelajahi Kain Nusantara
            </h2>
            <BatikDivider />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Tenun Ikat",
                color: "from-amber-700 to-amber-900",
                items: "248 produk",
                image:
                  "https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg",
              },
              {
                name: "Batik Tulis",
                color: "from-amber-800 to-amber-950",
                items: "312 produk",
                image:
                  "https://images.pexels.com/photos/37723814/pexels-photo-37723814.jpeg",
              },
              {
                name: "Songket",
                color: "from-amber-600 to-amber-800",
                items: "156 produk",
                image:
                  "https://images.pexels.com/photos/37038836/pexels-photo-37038836.jpeg",
              },
              {
                name: "Anyaman",
                color: "from-amber-700 to-amber-900",
                items: "189 produk",
                image:
                  "https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg",
              },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/customer/products`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gradient-to-br from-[#1a0f08] to-[#2a1a0e] border border-amber-800/30 hover:border-amber-600/50 transition-all duration-300"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 z-10" />
                <div
                  className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity z-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
                  <h3 className="font-serif font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-amber-400/60 text-xs mt-1">{cat.items}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <div className="w-8 h-8 rounded-full bg-amber-600/80 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONI ─── */}
      <section className="py-16 md:py-20 bg-white border-t border-amber-200/40 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-px bg-amber-600/40" />
                <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">
                  Testimoni
                </span>
                <div className="w-12 h-px bg-amber-600/40" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a120b]">
                Apa Kata Pelanggan?
              </h2>
              <BatikDivider />
            </div>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn
              testimonials={testimonials.slice(0, 3)}
              duration={15}
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(3, 6)}
              className="hidden md:block"
              duration={19}
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(6, 9)}
              className="hidden lg:block"
              duration={17}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f08] via-[#2d1a0e] to-[#1a0f08]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.6'/%3E%3Ccircle cx='20' cy='20' r='4' fill='none' stroke='%23c4944a' stroke-width='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative container mx-auto px-6 text-center text-white z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-amber-600/40" />
            <BatikStar className="w-4 h-4 text-amber-500" />
            <div className="w-16 h-px bg-amber-600/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-5">
            Mari Rawat Warisan Leluhur
          </h2>
          <p className="text-amber-100/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Setiap karya yang Anda koleksi membantu perajin di pelosok negeri
            tetap berkarya dan melestarikan budaya.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-amber-900/30 hover:-translate-y-0.5"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#1a0f08] text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                  <BatikStar className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-serif text-xl text-white tracking-wide leading-none">
                    TenunKita
                  </div>
                  <div className="text-[8px] text-amber-500/70 tracking-[0.25em] uppercase mt-0.5">
                    Warisan Nusantara
                  </div>
                </div>
              </div>
              <p className="text-amber-100/50 text-sm leading-relaxed max-w-sm">
                Platform terpercaya untuk membeli dan menjual kain tenun
                berkualitas dari seluruh Indonesia.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-[0.15em] mb-4">
                Belanja
              </h4>
              <ul className="space-y-2.5">
                {["Semua Produk", "Tenun Ikat", "Batik", "Songket"].map((l) => (
                  <li key={l}>
                    <Link
                      href="/produk"
                      className="text-amber-100/50 text-sm hover:text-amber-300 transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-[0.15em] mb-4">
                Perusahaan
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Tentang Kami",
                  "Pengrajin Lokal",
                  "Artikel Budaya",
                  "Kontak",
                ].map((l) => (
                  <li key={l}>
                    <Link
                      href="/about-us"
                      className="text-amber-100/50 text-sm hover:text-amber-300 transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-amber-800/20">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
              <div className="w-12 h-px bg-amber-600" />
              <BatikStar className="w-3 h-3 text-amber-600" />
              <div className="w-12 h-px bg-amber-600" />
            </div>
            <p className="text-amber-100/30 text-xs text-center">
              &copy; {new Date().getFullYear()} TenunKita. Melestarikan Budaya
              Nusantara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
