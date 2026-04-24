'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading on path or param change
    setLoading(true);
    
    // Simulate end of loading (since Next.js doesn't give a direct "navigation end" event in App Router easily)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div className="h-full bg-primary orange-glow animate-progress-bar"></div>
    </div>
  );
}
