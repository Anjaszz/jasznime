'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Play, Calendar, List, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
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
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/schedule" className="hover:text-primary transition-colors flex items-center gap-1">
            <Calendar size={16} /> Schedule
          </Link>
          <Link href="/genres" className="hover:text-primary transition-colors flex items-center gap-1">
            <List size={16} /> Genres
          </Link>
        </div>

        {/* Search and Mobile Toggle */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search anime..."
              className="bg-base-200 border border-white/10 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 md:w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </form>

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
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search anime..."
                className="bg-base-200 border border-white/10 rounded-xl py-3 px-4 pl-12 focus:outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            </form>
            <Link href="/" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/schedule" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Schedule</Link>
            <Link href="/genres" className="py-2 text-lg font-medium border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Genres</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
