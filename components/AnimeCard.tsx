import React from 'react';
import Link from 'next/link';
import { Play, Tv, Info } from 'lucide-react';
import { Anime } from '@/lib/api';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link href={`/anime/${anime.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl anime-card-hover bg-base-300">
      {/* Thumbnail */}
      <img
        src={anime.thumbnail}
        alt={anime.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Metadata */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {anime.type}
            </span>
            {anime.latest_episode && (
              <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {anime.latest_episode}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {anime.title}
          </h3>
        </div>
      </div>

      {/* Play Icon on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-primary/90 p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-300 orange-glow">
          <Play className="text-white fill-white" size={32} />
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
