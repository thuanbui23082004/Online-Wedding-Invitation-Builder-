import { Loader2 } from 'lucide-react';
 
export const LoadingState = ({ label = 'Đang tải dữ liệu...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center py-24 text-slate-400">
    <Loader2 size={28} className="animate-spin mb-3 text-rose-400" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);