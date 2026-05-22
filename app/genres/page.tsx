import React from 'react';
import { getGenres, getAnimeByGenre } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import { List, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default async function GenresPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; page?: string }>;
}) {
  const { name, page: pageStr } = await searchParams;
  const selectedGenre = name || '';
  const page = pageStr ? parseInt(pageStr) : 1;
  
  const genresData = await getGenres();
  let animeData = null;

  if (selectedGenre) {
    animeData = await getAnimeByGenre(selectedGenre, page);
  }

  if (genresData.status !== 'success') {
    return <div className="p-20 text-center">Gagal memuat genre.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Genre Sidebar - Back to original side position but with scrollable box */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="glass-panel rounded-3xl p-6 sticky top-24 border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <List size={20} className="text-primary" /> Genre
            </h2>
            
            {/* Scrollable list inside sidebar */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap lg:flex-col gap-2">
                {genresData.data.map((genre) => (
                  <Link
                    key={genre.slug}
                    href={`/genres?name=${genre.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      selectedGenre === genre.slug
                        ? 'bg-primary text-white border-primary orange-glow'
                        : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{genre.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedGenre === genre.slug ? 'bg-white/20' : 'bg-white/5'
                    }`}>
                      {genre.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          {!selectedGenre ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 glass-panel rounded-[40px] border border-white/5">
              <div className="bg-primary/20 p-8 rounded-full mb-6">
                <List size={48} className="text-primary" />
              </div>
              <h2 className="text-3xl font-black mb-4">Pilih Genre</h2>
              <p className="text-white/40 max-w-sm">
                Pilih genre dari daftar untuk menjelajahi koleksi anime kami.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-white capitalize">
                    {selectedGenre.replace('-', ' ')}
                  </h1>
                  <p className="text-white/40 text-sm mt-1">Jelajahi anime dalam kategori ini</p>
                </div>
                <div className="bg-primary/20 text-primary text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {selectedGenre}
                </div>
              </div>

              {animeData?.status === 'success' && animeData.data.anime.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {animeData.data.anime.map((item) => (
                      <AnimeCard key={item.slug} anime={item} />
                    ))}
                  </div>

                  <Pagination 
                    currentPage={page} 
                    totalPages={animeData.data.total_pages} 
                    baseUrl="/genres" 
                    queryParam="name"
                    queryValue={selectedGenre}
                  />
                </>
              ) : (
                <div className="p-20 text-center glass-panel rounded-3xl">
                  <p className="text-white/50">Tidak ada anime yang ditemukan dalam genre ini.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
