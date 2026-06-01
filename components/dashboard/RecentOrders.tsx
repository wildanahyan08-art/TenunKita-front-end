'use client';

import Image from 'next/image';
import { Order } from '@/types';

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Menunggu',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
};

export const RecentOrders = ({ orders }: RecentOrdersProps) => {
  return (
    <div className="bg-white rounded-xl border border-amber-100 overflow-hidden">
      <div className="p-5 border-b border-amber-100">
        <h3 className="font-serif font-bold text-[#1a120b] text-lg">Pesanan Terbaru</h3>
        <p className="text-gray-400 text-xs mt-1">Aktivitas transaksi terakhir Anda</p>
      </div>
      <div className="divide-y divide-amber-50">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Belum ada pesanan
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-amber-50/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-amber-50 shrink-0">
                  <Image 
                    src={order.productImage} 
                    alt={order.productName} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#1a120b] text-sm truncate">{order.productName}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1a120b]">Rp {order.price.toLocaleString()}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-amber-100 bg-amber-50/30">
        <button className="w-full text-center text-amber-700 text-sm font-medium hover:text-amber-900 transition-colors">
          Lihat Semua Pesanan →
        </button>
      </div>
    </div>
  );
};