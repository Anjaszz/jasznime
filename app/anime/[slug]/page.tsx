import React from 'react';
import { getDetail } from '@/lib/api';
import Link from 'next/link';
import { Play, Calendar, Star, Clock, User, Share2, Heart, List, Info } from 'lucide-react';

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detailData = await getDetail(slug);

  if (detailData.status !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-xl text-white/50">Anime not found or API error.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const anime = detailData.data;

  return (
    <div className="min-h-screen">
      {/* Backdrop Header */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/60 to-transparent z-10" />
        <img 
          src={anime.thumbnail} 
          alt={anime.title} 
          className="w-full h-full object-cover opacity-30 blur-sm scale-105"
        />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-60 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Poster & Info */}
          <div className="w-full md:w-72 shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 mb-6 anime-card-hover">
              <img src={anime.thumbnail} alt={anime.title} className="w-full h-auto" />
            </div>
            
            <div className="glass-panel rounded-2xl p-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Status</span>
                <span className="text-primary font-bold">{anime.info.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Type</span>
                <span className="text-white font-medium">{anime.info.tipe}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Episodes</span>
                <span className="text-white font-medium">{anime.info.total_episode}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Studio</span>
                <span className="text-white font-medium">{anime.info.studio}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Released</span>
                <span className="text-white font-medium">{anime.info.dirilis}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-grow">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              {anime.title}
            </h1>

            {/* Tags/Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {anime.info.genres?.map((genre) => (
                <Link 
                  key={genre} 
                  href={`/genres?name=${genre.toLowerCase()}`}
                  className="bg-white/5 hover:bg-primary/20 hover:text-primary px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-white/5"
                >
                  {genre}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link 
                href={`/watch/${anime.episodes[0]?.slug}`} 
                className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 orange-glow"
              >
                <Play size={20} fill="white" /> Watch Episode 1
              </Link>
              <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all">
                <Heart size={24} />
              </button>
              <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all">
                <Share2 size={24} />
              </button>
            </div>

            {/* Synopsis */}
            <div className="glass-panel rounded-3xl p-8 mb-10 border border-white/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <Info size={20} /> Synopsis
              </h2>
              <p className="text-white/70 leading-relaxed text-sm md:text-base">
                {anime.synopsis}
              </p>
            </div>

            {/* Episode List */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                Episodes <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">{(anime.episodes?.length || 0)} Items</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anime.episodes?.map((ep) => (
                  <Link 
                    key={ep.slug} 
                    href={`/watch/${ep.slug}`}
                    className="flex items-center justify-between p-4 bg-base-300 hover:bg-white/5 rounded-xl border border-white/5 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-base-200 rounded-lg flex items-center justify-center font-bold text-white/40 group-hover:bg-primary group-hover:text-white transition-colors">
                        {ep.number}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                          {ep.title}
                        </h4>
                        <span className="text-[10px] text-white/30">{ep.date}</span>
                      </div>
                    </div>
                    <Play size={16} className="text-white/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
