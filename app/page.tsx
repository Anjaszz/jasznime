import React from 'react';
import { getHome } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import { Play, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = pageStr ? parseInt(pageStr) : 1;
  const homeData = await getHome(page);

  if (homeData.status !== 'success') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-white/50">Gagal memuat data anime.</p>
      </div>
    );
  }

  const { anime, total_pages } = homeData.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 relative overflow-hidden rounded-3xl bg-base-300 min-h-[300px] md:min-h-[450px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-1000 hover:scale-105" 
          style={{ backgroundImage: `url('https://images.alphacoders.com/133/1338573.png')` }} 
        />
        
        <div className="relative z-20 p-8 md:p-16 max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-bold mb-4 animate-bounce">
            <Sparkles size={20} />
            <span className="uppercase tracking-widest text-xs md:text-sm">Anime Musiman Unggulan</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Jelajahi Petualangan <span className="text-primary">Tanpa Batas</span>
          </h1>
          <p className="text-white/70 text-sm md:text-lg mb-8 line-clamp-3">
            Streaming judul anime terbaru dan terbaik dengan kualitas jernih dan integrasi subtitle yang mulus. Perjalanan anime Anda dimulai di sini.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 orange-glow">
              <Play size={20} fill="white" /> Tonton Sekarang
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold transition-all">
              Pelajari Selengkapnya
            </button>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              Pembaruan Terbaru <div className="h-1 w-12 bg-primary rounded-full" />
            </h2>
            <p className="text-white/50 text-sm mt-1">Episode dan serial yang baru ditambahkan</p>
          </div>
          
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {anime.map((item) => (
            <AnimeCard key={item.slug} anime={item} />
          ))}
        </div>

        <Pagination 
          currentPage={page} 
          totalPages={10} 
          baseUrl="/" 
        />
      </section>
    </div>
  );
}
