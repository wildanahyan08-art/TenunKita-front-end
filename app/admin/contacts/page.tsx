'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Mail, Phone, MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      setError('no_token');
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tenunkita-production.up.railway.app';

    fetch(`${API_URL}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data');
        return res.json();
      })
      .then((result) => {
        const data: Contact[] = Array.isArray(result) ? result : (result.data || []);
        setContacts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('fetch_error');
        setIsLoading(false);
      });
  }, [router]);

  const handleMarkRead = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setUpdatingId(id);
    try {
      await api.updateContactStatus(token, id, 'READ');
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'READ' as const } : c)));
    } catch {
      alert('Gagal mengubah status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkUnread = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setUpdatingId(id);
    try {
      await api.updateContactStatus(token, id, 'UNREAD');
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'UNREAD' as const } : c)));
    } catch {
      alert('Gagal mengubah status');
    } finally {
      setUpdatingId(null);
    }
  };

  const unreadCount = contacts.filter((c) => c.status === 'UNREAD').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg" />
            <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-12 rounded-lg" />
            <div className="absolute inset-4 border-2 border-amber-600/40 rotate-12 rounded-lg" />
            <div className="absolute inset-6 border-2 border-amber-600/60 rounded-lg" />
          </div>
          <p className="text-amber-800 font-serif text-lg">Memuat pesan kontak...</p>
          <div className="w-32 h-0.5 bg-amber-200 mx-auto mt-4 overflow-hidden rounded-full">
            <div className="w-full h-full bg-amber-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error === 'no_token') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Akses Terbatas</h2>
          <p className="text-gray-500 text-sm mb-8">Anda perlu masuk untuk mengakses halaman ini</p>
          <a href="/sign-in" className="inline-flex items-center justify-center px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all shadow-md w-full">
            Masuk Sekarang
          </a>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-amber-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-8">Terjadi kesalahan saat mengambil data kontak. Pastikan endpoint <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-mono">GET /contacts</code> tersedia di backend.</p>
          <button onClick={() => window.location.reload()} className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl transition-all">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Hero header */}
      <div className="relative bg-[#1a0f08] overflow-hidden">
        <div className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='10' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='10' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%23c4944a' stroke-width='0.8'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600/50" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-600/70">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600/50" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide">
              Pesan Kontak
            </h1>
            <p className="text-amber-400/60 font-serif italic text-sm md:text-base mt-2">
              Kelola pesan dari pengunjung TenunKita
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
              <div className="w-2 h-2 bg-amber-600/50 rotate-45" />
              <div className="w-8 h-8 border border-amber-700/30 rotate-45" />
            </div>
          </div>
        </div>
        <div className="h-6 bg-gradient-to-b from-[#1a0f08] to-[#faf6f0]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 pt-24 md:pt-28">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-[#1a120b]">{contacts.length}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Total Pesan</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-amber-700">{unreadCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Belum Dibaca</p>
          </div>
          <div className="bg-white rounded-xl border border-amber-200/40 p-5">
            <p className="text-2xl md:text-3xl font-bold text-emerald-700">{contacts.length - unreadCount}</p>
            <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-[0.15em] mt-1">Sudah Dibaca</p>
          </div>
        </div>

        {/* Contact list */}
        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-amber-200/40 p-12 text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-serif text-lg">Belum ada pesan kontak</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((contact) => (
                <div
                  key={contact.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                    contact.status === 'UNREAD'
                      ? 'border-amber-300 shadow-sm'
                      : 'border-amber-200/40'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                    className="w-full text-left p-5 flex items-center gap-4 hover:bg-amber-50/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      contact.status === 'UNREAD'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1a120b] text-sm">{contact.name}</span>
                        {contact.status === 'UNREAD' && (
                          <span className="px-2 py-0.5 bg-amber-600 text-white text-[9px] font-bold rounded-md tracking-wider">BARU</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{contact.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-gray-400 font-medium">{formatDate(contact.createdAt)}</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {contact.status === 'UNREAD' ? (
                          <Clock className="w-3 h-3 text-amber-500" />
                        ) : (
                          <Eye className="w-3 h-3 text-emerald-500" />
                        )}
                        <span className={`text-[10px] font-semibold ${
                          contact.status === 'UNREAD' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {contact.status === 'UNREAD' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                        </span>
                        {expandedId === contact.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-300 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-300 ml-1" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expandedId === contact.id && (
                    <div className="px-5 pb-5 pt-0 border-t border-amber-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-3 bg-amber-50/70 px-4 py-3 rounded-xl">
                          <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                            <p className="text-sm font-medium text-[#1a120b]">{contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-amber-50/70 px-4 py-3 rounded-xl">
                          <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Telepon</p>
                            <p className="text-sm font-medium text-[#1a120b]">{contact.phone || '—'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-amber-50/70 px-4 py-3 rounded-xl">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Dikirim</p>
                            <p className="text-sm font-medium text-[#1a120b]">{formatDate(contact.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 bg-amber-50/50 px-4 py-4 rounded-xl border border-amber-100/60">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Pesan</p>
                        <p className="text-sm text-[#1a120b] leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                      </div>
                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          onClick={() => handleMarkRead(contact.id)}
                          disabled={updatingId === contact.id}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                            contact.status === 'UNREAD'
                              ? 'bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {updatingId === contact.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Sudah Dibaca
                        </button>
                        <button
                          onClick={() => handleMarkUnread(contact.id)}
                          disabled={updatingId === contact.id}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                            contact.status === 'READ'
                              ? 'bg-amber-700 hover:bg-amber-600 disabled:bg-amber-400 text-white'
                              : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {updatingId === contact.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          Belum Dibaca
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-px bg-amber-300/40" />
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-400/40">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
            </svg>
            <div className="w-6 h-px bg-amber-300/40" />
          </div>
          <p className="text-gray-400 text-xs font-medium">TenunKita Admin v1.0</p>
          <p className="text-gray-400/60 text-[11px] mt-1">&copy; {new Date().getFullYear()} TenunKita. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
