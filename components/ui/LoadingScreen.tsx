'use client';

import { useState, useEffect } from 'react';

export const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onLoad = () => setLoading(false);

    if (document.readyState === 'complete') {
      const id = setTimeout(onLoad, 0);
      return () => clearTimeout(id);
    }

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf6f0] transition-opacity duration-700">
          <object
            data="/30dc651c-117a-11ee-8f06-2b7e9b9b1b53.svg"
            type="image/svg+xml"
            className="w-32 h-32 pointer-events-none"
            aria-label="Loading"
          />
          <h1 className="mt-6 text-2xl font-semibold tracking-wide text-[#1a120b]">
            TenunKita
          </h1>
          <p className="mt-1 text-sm text-amber-600/70">Memuat...</p>
        </div>
      )}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {children}
      </div>
    </>
  );
};
