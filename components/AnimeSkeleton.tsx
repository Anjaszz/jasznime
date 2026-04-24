import React from 'react';

const AnimeSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[3/4] w-full bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
          <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded-lg"></div>
          <div className="h-3 w-1/2 bg-white/5 animate-pulse rounded-lg opacity-50"></div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSkeleton;
