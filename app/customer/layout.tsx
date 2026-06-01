'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'BUYER') {
        router.push('/');
        return;
      }
    } catch {
      router.push('/sign-in');
    }
  }, [router]);

  const isProductPage = pathname === '/customer/products' || pathname.startsWith('/customer/products/');

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <Navbar />
      <main>
        {isProductPage ? (
          children
        ) : (
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        )}
      </main>
    </div>
  );
}
