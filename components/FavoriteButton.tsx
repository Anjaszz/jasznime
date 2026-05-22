'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/favorite';

interface FavoriteButtonProps {
  anime: {
    slug: string;
    title: string;
    thumbnail: string;
    type?: string;
  };
}

export default function FavoriteButton({ anime }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(anime.slug));

    const handleFavoritesChange = () => {
      setIsFav(isFavorite(anime.slug));
    };

    window.addEventListener('favoritesChange', handleFavoritesChange);
    return () => {
      window.removeEventListener('favoritesChange', handleFavoritesChange);
    };
  }, [anime.slug]);

  const handleToggle = () => {
    const isAdded = toggleFavorite(anime);
    setIsFav(isAdded);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-4 rounded-xl transition-all border ${
        isFav
          ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-red-500 hover:border-red-500/30'
      } ${animate ? 'scale-125' : 'hover:scale-105'} active:scale-95`}
      aria-label={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
      title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
    >
      <Heart
        size={24}
        className={`transition-all duration-300 ${isFav ? 'fill-red-500 scale-110' : ''}`}
      />
    </button>
  );
}
