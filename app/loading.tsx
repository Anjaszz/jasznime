import React from 'react';
import AnimeSkeleton from '@/components/AnimeSkeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Skeleton */}
      <div className="w-full h-[300px] md:h-[450px] bg-white/5 animate-pulse rounded-[40px] border border-white/5"></div>
      
      {/* Grid Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 animate-pulse rounded-xl"></div>
          <div className="h-4 w-32 bg-white/5 animate-pulse rounded-lg opacity-50"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <AnimeSkeleton />
    </div>
  );
}
