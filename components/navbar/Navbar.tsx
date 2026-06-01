// components/navbar/Navbar.tsx
'use client';

import Link from "next/link";
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  Search,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  _count: { products: number };
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-');

// Komponen ornamen batik
const BatikOrnament = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="text-amber-500/70"
  >
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  // Cek status login dari localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userData);
        setUserName(user.name);
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    } else {
      setIsAuthenticated(false);
      setUserName(null);
    }
  }, [pathname]); // Re-check ketika pindah halaman

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName(null);
    router.push('/');
  };

  // Fetch categories untuk dropdown Produk
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';
    fetch(`${API_URL}/categories`)
      .then((res) => res.ok ? res.json() : [])
      .then((result) => {
        const data: Category[] = Array.isArray(result) ? result : (result.data || []);
        setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = useMemo(() => [
    { name: "Beranda", href: "/" },
    {
      name: "Produk",
      href: "/customer/products",
      dropdown: [
        { name: "Semua Produk", href: "/customer/products" },
        ...categories.map((c) => ({
          name: c.name,
          href: `/customer/products?kategori=${slugify(c.name)}`,
          count: c._count?.products,
        })),
      ],
    },
    {
      name: "Edukasi Budaya",
      href: "/education",
    },
    { name: "Tentang Kami", href: "/about-us" },
    { name: "Kontak", href: "/contact" },
  ], [categories]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href.split("?")[0]);

  return (
    <>
      {/* Top cultural strip */}
      <div className="fixed top-0 w-full z-50">
        <div
          className={`transition-all duration-500 ${isScrolled ? "h-0 overflow-hidden" : "h-7 bg-[#1a0f08]"}`}
        >
          <div className="container mx-auto px-6 h-full flex items-center justify-between">
            <p className="text-[10px] text-amber-400/70 tracking-[0.2em] uppercase font-medium">
              ✦ Melestarikan Warisan Budaya Nusantara ✦
            </p>
            <div className="flex items-center gap-4 text-[10px] text-amber-400/60 tracking-wider">
              {isAuthenticated ? (
                <>
                  <span className="text-amber-300/80">{userName}</span>
                  <span className="text-amber-700">|</span>
                  <button
                    onClick={handleLogout}
                    className="hover:text-amber-300 transition"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="hover:text-amber-300 transition"
                  >
                    Masuk
                  </Link>
                  <span className="text-amber-700">|</span>
                  <Link
                    href="/sign-up"
                    className="hover:text-amber-300 transition"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <nav
          className={`transition-all duration-500 ${
            isScrolled
              ? "bg-[#1c1008]/97 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-amber-800/20"
              : "bg-gradient-to-b from-[#1a0f08]/95 to-[#1a0f08]/80 backdrop-blur-sm"
          }`}
        >
          {/* Batik top border */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-center h-[68px]">
              {/* Logo */}
              <Link
                href="/"
                className="group flex items-center gap-2.5 shrink-0"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-600/30 transition-all duration-300">
                    <BatikOrnament />
                  </div>
                </div>
                <div>
                  <div className="font-serif text-xl text-white tracking-wide leading-none group-hover:text-amber-200 transition-colors duration-300">
                    TenunKita
                  </div>
                  <div className="text-[8px] text-amber-500/70 tracking-[0.25em] uppercase mt-0.5">
                    Warisan Nusantara
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() =>
                      link.dropdown && setActiveDropdown(link.name)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive(link.href)
                          ? "text-amber-400"
                          : "text-amber-100/80 hover:text-amber-300"
                      }`}
                    >
                      <span className="relative">
                        {link.name}
                        {isActive(link.href) && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-amber-500 rounded-full" />
                        )}
                      </span>
                      {link.dropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>

                    {/* Dropdown */}
                    {link.dropdown && activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-[#1c1008] border border-amber-800/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
                        <div className="py-2">
                          {link.dropdown.map((item: any) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 transition-all duration-150"
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-amber-600/50 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </span>
                              {item.count != null && (
                                <span className="text-[10px] text-amber-500/50 font-medium shrink-0">{item.count}</span>
                              )}
                            </Link>
                          ))}
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <button
                  className="hidden md:flex p-2.5 text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                  aria-label="Cari produk"
                >
                  <Search className="w-4.5 h-4.5" />
                </button>

                <Link
                  href={isAuthenticated ? "/customer/profile" : "/sign-in"}
                  className="hidden md:flex p-2.5 text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                  aria-label="Akun saya"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex p-2.5 text-amber-100/70 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    aria-label="Keluar"
                    title="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}

                <Link
                  href={isAuthenticated ? "/keranjang" : "/sign-in"}
                  className="relative flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
                  aria-label="Keranjang belanja"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Keranjang
                  </span>
                </Link>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-2.5 text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition ml-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Batik bottom border */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-400 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full bg-[#140d06] border-l border-amber-800/20 shadow-2xl transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between p-5 border-b border-amber-800/20">
            <div className="font-serif text-lg text-white">TenunKita</div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-amber-400 hover:bg-amber-900/30 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile links */}
          <div className="overflow-y-auto h-full pb-24 py-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-amber-400 bg-amber-900/20 border-r-2 border-amber-500"
                      : "text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/20"
                  }`}
                >
                  {link.name}
                </Link>
                {link.dropdown && (
                  <div className="bg-black/20 border-l-2 border-amber-800/20 ml-5">
                    {link.dropdown.slice(1).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs text-amber-100/50 hover:text-amber-300 hover:bg-amber-900/20 transition-all"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-600/40" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mx-5 mt-6 pt-6 border-t border-amber-800/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-center text-amber-300/80 text-sm font-medium py-2">
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full border border-red-700/40 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-900/20 transition"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 w-full border border-amber-700/40 text-amber-300 py-3 rounded-xl text-sm font-medium hover:bg-amber-900/20 transition"
                  >
                    <User className="w-4 h-4" /> Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 w-full bg-amber-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition"
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>

            <p className="text-center text-[10px] text-amber-700/50 italic font-serif mt-8 px-5">
              "Bangga Pakai Tenun Indonesia"
            </p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div
        className={`transition-all duration-500 ${isScrolled ? "h-[68px]" : "h-[95px]"}`}
      />
    </>
  );
}