'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Play, Calendar, List, Menu, X, History, Trash2, Clock, Heart } from 'lucide-react';
import {
  getWatchHistory,
  clearWatchHistory,
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  WatchHistoryItem
} from '@/lib/history';
import {
  getFavorites,
  removeFavorite,
  clearFavorites,
  FavoriteItem
} from '@/lib/favorite';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  const router = useRouter();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch
    setWatchHistory(getWatchHistory());
    setSearchHistory(getSearchHistory());
    setFavorites(getFavorites());

    // Listen to changes
    const handleWatchHistoryChange = () => {
      setWatchHistory(getWatchHistory());
    };
    const handleSearchHistoryChange = () => {
      setSearchHistory(getSearchHistory());
    };
    const handleFavoritesChange = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener('watchHistoryChange', handleWatchHistoryChange);
    window.addEventListener('searchHistoryChange', handleSearchHistoryChange);
    window.addEventListener('favoritesChange', handleFavoritesChange);

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setIsMobileSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('watchHistoryChange', handleWatchHistoryChange);
      window.removeEventListener('searchHistoryChange', handleSearchHistoryChange);
      window.removeEventListener('favoritesChange', handleFavoritesChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      addToSearchHistory(searchQuery);
      setIsMenuOpen(false);
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  };

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    addToSearchHistory(query);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    setIsMenuOpen(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg orange-glow group-hover:scale-110 transition-transform">
            <Play className="text-white fill-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            JASZ<span className="text-primary">NIME</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <Link href="/schedule" className="hover:text-primary transition-colors flex items-center gap-1">
            <Calendar size={16} /> Jadwal
          </Link>
          <Link href="/genres" className="hover:text-primary transition-colors flex items-center gap-1">
            <List size={16} /> Genre
          </Link>

          {/* Recent Views Dropdown */}
          <div className="relative group/history">
            <button className="hover:text-primary transition-colors flex items-center gap-1 py-1">
              <History size={16} /> Terakhir Ditonton
            </button>
            <div className="absolute right-0 top-full mt-2 w-80 glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover/history:opacity-100 group-hover/history:visible transition-all duration-300 z-50">
              {watchHistory.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-white/40 text-center text-xs">
                  <History size={28} className="mb-2 opacity-50" />
                  <p>Belum ada riwayat nonton</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-white/70">Terakhir Ditonton</span>
                    <button 
                      onClick={() => clearWatchHistory()}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-bold"
                    >
                      <Trash2 size={12} /> Hapus Semua
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {watchHistory.slice(0, 5).map((item) => (
                      <Link 
                        key={item.slug}
                        href={item.episodeSlug ? `/watch/${item.episodeSlug}` : `/anime/${item.slug}`}
                        className="flex gap-3 hover:bg-white/5 p-2 rounded-xl transition-all group/item"
                      >
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-base-200 shrink-0 border border-white/5">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                              <Play size={16} fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <h5 className="text-xs font-bold text-white group-hover/item:text-primary transition-colors line-clamp-1">
                              {item.title}
                            </h5>
                            {item.episodeTitle && (
                              <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                                Lanjut: {item.episodeTitle.replace(item.title + ' - ', '')}
                              </p>
                            )}
                          </div>
                          <span className="text-[9px] text-white/30 flex items-center gap-1">
                            <Clock size={10} /> {formatTimeAgo(item.lastViewed)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Favorites Dropdown */}
          <div className="relative group/favorites">
            <button className="hover:text-primary transition-colors flex items-center gap-1 py-1">
              <Heart size={16} /> Favorit
            </button>
            <div className="absolute right-0 top-full mt-2 w-80 glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover/favorites:opacity-100 group-hover/favorites:visible transition-all duration-300 z-50">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-white/40 text-center text-xs">
                  <Heart size={28} className="mb-2 opacity-50" />
                  <p>Belum ada anime favorit</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-white/70">Daftar Favorit</span>
                    <button 
                      onClick={() => clearFavorites()}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-bold"
                    >
                      <Trash2 size={12} /> Hapus Semua
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {favorites.map((item) => (
                      <div key={item.slug} className="flex items-center justify-between group/item">
                        <Link 
                          href={`/anime/${item.slug}`}
                          className="flex gap-3 hover:bg-white/5 p-2 rounded-xl transition-all flex-grow min-w-0"
                        >
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-base-200 shrink-0 border border-white/5">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                                <Play size={16} fill="currentColor" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <h5 className="text-xs font-bold text-white group-hover/item:text-primary transition-colors line-clamp-2">
                              {item.title}
                            </h5>
                            {item.type && (
                              <p className="text-[10px] text-white/50 mt-0.5">
                                {item.type}
                              </p>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFavorite(item.slug)}
                          className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all ml-1 shrink-0"
                          title="Hapus dari Favorit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search and Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div ref={desktopSearchRef} className="relative hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari anime..."
                className="bg-base-200 border border-white/10 rounded-full py-2 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 md:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Search History Dropdown */}
            {isSearchFocused && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-xs">
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/5">
                  <span className="font-bold text-white/50">Terakhir Dicari</span>
                  <button 
                    type="button" 
                    onClick={() => clearSearchHistory()}
                    className="text-primary hover:text-primary/80 font-bold"
                  >
                    Hapus
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((query) => (
                    <div 
                      key={query}
                      className="flex justify-between items-center hover:bg-white/5 rounded-lg px-2 py-1.5 cursor-pointer group/search-item"
                    >
                      <span 
                        className="flex-grow text-white/80 group-hover/search-item:text-white transition-colors"
                        onClick={() => handleSearchSelect(query)}
                      >
                        {query}
                      </span>
                      <button 
                        type="button"
                        onClick={() => removeFromSearchHistory(query)}
                        className="text-white/20 hover:text-primary transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            <div ref={mobileSearchRef} className="relative w-full">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari anime..."
                  className="bg-base-200 border border-white/10 rounded-xl py-3 px-4 pl-12 pr-10 focus:outline-none w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsMobileSearchFocused(true)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </form>

              {/* Mobile Search History Dropdown */}
              {isMobileSearchFocused && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel border border-white/10 rounded-2xl p-3 shadow-2xl z-50 text-xs">
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/5">
                    <span className="font-bold text-white/50">Terakhir Dicari</span>
                    <button 
                      type="button" 
                      onClick={() => clearSearchHistory()}
                      className="text-primary hover:text-primary/80 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((query) => (
                      <div 
                        key={query}
                        className="flex justify-between items-center hover:bg-white/5 rounded-lg px-2 py-1.5 cursor-pointer group/search-item"
                      >
                        <span 
                          className="flex-grow text-white/80 group-hover/search-item:text-white transition-colors"
                          onClick={() => handleSearchSelect(query)}
                        >
                          {query}
                        </span>
                        <button 
                          type="button"
                          onClick={() => removeFromSearchHistory(query)}
                          className="text-white/20 hover:text-primary transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Beranda</Link>
            <Link href="/schedule" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Jadwal</Link>
            <Link href="/genres" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Genre</Link>

            {/* Mobile Watch History */}
            {watchHistory.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-xs font-bold text-white/50">Terakhir Ditonton</span>
                  <button 
                    onClick={() => clearWatchHistory()} 
                    className="text-[10px] text-primary font-bold flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Hapus
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {watchHistory.slice(0, 5).map((item) => (
                    <Link
                      key={item.slug}
                      href={item.episodeSlug ? `/watch/${item.episodeSlug}` : `/anime/${item.slug}`}
                      className="flex gap-2 hover:bg-white/5 p-2 rounded-xl shrink-0 w-48 bg-base-300/50 border border-white/5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-base-200 shrink-0 border border-white/5">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                            <Play size={12} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between py-0.5 min-w-0">
                        <h5 className="text-[11px] font-bold text-white line-clamp-1">{item.title}</h5>
                        {item.episodeTitle && (
                          <p className="text-[9px] text-white/50 line-clamp-1">
                            {item.episodeTitle.replace(item.title + ' - ', '')}
                          </p>
                        )}
                        <span className="text-[8px] text-white/30">{formatTimeAgo(item.lastViewed)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Favorites */}
            {favorites.length > 0 && (
              <div className="border-t border-white/5 pt-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-xs font-bold text-white/50">Anime Favorit</span>
                  <button 
                    onClick={() => clearFavorites()} 
                    className="text-[10px] text-primary font-bold flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Hapus Semua
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {favorites.map((item) => (
                    <div key={item.slug} className="relative shrink-0 w-48 bg-base-300/50 border border-white/5 rounded-xl">
                      <Link
                        href={`/anime/${item.slug}`}
                        className="flex gap-2 p-2 min-w-0"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="w-10 h-14 rounded-lg overflow-hidden bg-base-200 shrink-0 border border-white/5">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                              <Play size={12} fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h5 className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{item.title}</h5>
                          {item.type && (
                            <p className="text-[9px] text-white/50 mt-0.5">{item.type}</p>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={() => removeFavorite(item.slug)}
                        className="absolute top-1 right-1 p-1.5 bg-black/60 hover:bg-red-500 text-white/70 hover:text-white rounded-lg transition-all"
                        title="Hapus"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
