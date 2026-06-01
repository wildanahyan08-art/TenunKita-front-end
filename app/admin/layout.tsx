'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  ShoppingBag,
  Wallet,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

const menuItems = [
  { name: 'Profil', icon: LayoutDashboard, href: '/admin/profile' },
  { name: 'Produk', icon: Package, href: '/admin/products' },
  { name: 'Kategori', icon: FolderTree, href: '/admin/categories' },
  { name: 'Pelanggan', icon: Users, href: '/admin/customers' },
  { name: 'Pesanan', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Pembayaran', icon: Wallet, href: '/admin/payments' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      setAdmin(parsed);
    } catch {
      router.push('/sign-in');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 bg-white rounded-xl shadow-lg text-amber-700 border border-amber-100 hover:bg-amber-50 transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-amber-100 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-amber-100">
          <Link href="/admin/profile" className="block">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TK</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-[#1a120b] text-base leading-tight">TenunKita</h1>
                <p className="text-[9px] text-amber-600/70 tracking-[0.2em] uppercase font-semibold">Panel Admin</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Admin info */}
        {admin && (
          <div className="px-5 py-4 border-b border-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {admin.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1a120b] truncate">{admin.name}</p>
                <p className="text-[11px] text-amber-600/70 truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-200' : 'text-gray-400 group-hover:text-amber-600'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-4.5 h-4.5 text-red-400 group-hover:text-red-600" />
            <span>Keluar</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 text-center border-t border-amber-50">
          <p className="text-[9px] text-gray-400 tracking-[0.15em] uppercase">
            &copy; 2025 TenunKita
          </p>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#faf6f0]/90 backdrop-blur-md border-b border-amber-100/60">
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 lg:px-8 py-3 ml-14 lg:ml-0">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white text-[10px] font-bold">
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-[#1a120b] hidden sm:block">{admin?.name || 'Admin'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-amber-100 rounded-xl shadow-lg z-20 overflow-hidden">
                    <div className="p-3 border-b border-amber-50">
                      <p className="text-sm font-semibold text-[#1a120b]">{admin?.name}</p>
                      <p className="text-xs text-gray-400">{admin?.email}</p>
                    </div>
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      Ke Website
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-amber-50"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
