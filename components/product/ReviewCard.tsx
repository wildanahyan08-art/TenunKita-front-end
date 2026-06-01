'use client';

import { Star, User } from 'lucide-react';
import type { Review } from '@/lib/api';

interface ReviewCardProps {
  review: Review;
}

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(dateStr)
  );

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-amber-200/40 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-[#1a120b]">{review.user.name}</h4>
            <time className="text-[11px] text-gray-400">{formatDate(review.createdAt)}</time>
          </div>
          <div className="flex items-center gap-0.5 mt-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.score
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
