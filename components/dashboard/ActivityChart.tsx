'use client';

interface ActivityData {
  day: string;
  count: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  title?: string;
}

export const ActivityChart = ({ data, title = 'Aktivitas Mingguan' }: ActivityChartProps) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="bg-white rounded-xl border border-amber-100 p-5">
      <h3 className="font-serif font-bold text-[#1a120b] text-lg mb-4">{title}</h3>
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item) => (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-gradient-to-t from-amber-600 to-amber-500 rounded-lg transition-all duration-500 hover:from-amber-700 hover:to-amber-600"
              style={{ height: `${(item.count / maxCount) * 120}px` }}
            />
            <span className="text-xs text-gray-500">{item.day}</span>
            <span className="text-xs font-medium text-amber-700">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};