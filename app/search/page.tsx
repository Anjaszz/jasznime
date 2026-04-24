import React from 'react';
import { searchAnime } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import { Search as SearchIcon, Frown } from 'lucide-react';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const query = q || '';
  const page = pageStr ? parseInt(pageStr) : 1;
  
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center">
        <div className="bg-base-300 p-8 rounded-full mb-6">
          <SearchIcon size={48} className="text-white/20" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Search for your favorite anime</h2>
        <p className="text-white/50 text-center max-w-md">
          Type the title of the anime you want to watch in the search bar above.
        </p>
      </div>
    );
  }

  const searchData = await searchAnime(query, page);

  if (searchData.status !== 'success' || !searchData.data.anime.length) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center">
        <div className="bg-base-300 p-8 rounded-full mb-6">
          <Frown size={48} className="text-primary/50" />
        </div>
        <h2 className="text-2xl font-bold mb-4">No results found for "{query}"</h2>
        <p className="text-white/50 text-center mb-8">
          Try different keywords or check for typos.
        </p>
        <Link href="/" className="btn btn-primary orange-glow">Back to Home</Link>
      </div>
    );
  }

  const { anime, total_pages } = searchData.data;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
          Search Results
        </h1>
        <p className="text-white/50">
          Showing results for <span className="text-primary font-bold">"{query}"</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {anime.map((item) => (
          <AnimeCard key={item.slug} anime={item} />
        ))}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={total_pages} 
        baseUrl="/search" 
        queryParam="q"
        queryValue={query}
      />
    </div>
  );
}
