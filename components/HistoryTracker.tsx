'use client';

import { useEffect } from 'react';
import { addToWatchHistory } from '@/lib/history';

interface HistoryTrackerProps {
  anime: {
    slug: string;
    title: string;
    thumbnail: string;
    type?: string;
  };
}

export default function HistoryTracker({ anime }: HistoryTrackerProps) {
  useEffect(() => {
    if (anime && anime.slug) {
      addToWatchHistory(anime);
    }
  }, [anime]);

  return null;
}
