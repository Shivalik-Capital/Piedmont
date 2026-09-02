import React from 'react';

export function ShimmerCard() {
  return (
    <div className="glass-card rounded-2xl h-[180px] p-6 flex flex-col justify-between overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-24 bg-white/5 rounded" />
          <div className="h-4 w-16 bg-white/5 rounded" />
        </div>
        <div className="h-8 w-8 bg-white/5 rounded-xl" />
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/5 rounded" />
          <div className="h-4 w-20 bg-white/5 rounded" />
        </div>
        <div className="h-12 w-24 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export function ShimmerRow() {
  return (
    <div className="glass-card rounded-xl h-[60px] p-4 flex items-center justify-between overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="space-y-1.5">
        <div className="h-4 w-24 bg-white/5 rounded" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="h-8 w-16 bg-white/5 rounded" />
        <div className="h-6 w-12 bg-white/5 rounded-full" />
      </div>
    </div>
  );
}

export function ShimmerText({ width = 'w-full' }: { width?: string }) {
  return (
    <div className={`h-4 ${width} bg-white/5 rounded overflow-hidden relative`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}
