'use client';

import React, { useState, useEffect } from 'react';
import { getSchedule, ScheduleResponse, Anime } from '@/lib/api';
import { Calendar, Clock, Play, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

export default function SchedulePage() {
  const [data, setData] = useState<ScheduleResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"];
  
  // Default to today if possible, or Senin
  const [activeDay, setActiveDay] = useState("Senin");

  useEffect(() => {
    getSchedule().then(res => {
      if (res.status === 'success') {
        setData(res.data);
      }
      setLoading(false);
    });

    // Set today as active day
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const today = dayNames[new Date().getDay()];
    setActiveDay(today);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-white/50 animate-pulse">Loading schedule...</p>
      </div>
    );
  }

  const schedule = data || {};

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
            <Calendar size={14} /> Anime Release Schedule
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white">
            Daily <span className="text-primary">Updates</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Never miss an episode. Stay updated with the latest release times for your favorite anime series.
          </p>
        </div>

        {/* Day Selector (Tabs) */}
        <div className="sticky top-20 z-30 bg-base-100/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5">
          <div className="flex overflow-x-auto gap-2 no-scrollbar justify-start md:justify-center">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-none px-8 py-4 rounded-2xl text-sm font-black transition-all border ${
                  activeDay === day
                    ? 'bg-primary text-white border-primary orange-glow scale-105'
                    : 'bg-base-300 text-white/40 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {schedule[activeDay] && schedule[activeDay].length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {schedule[activeDay].map((anime: any, idx: number) => (
                <Link 
                  key={`${activeDay}-${idx}`} 
                  href={`/anime/${anime.slug}`}
                  className="group relative flex flex-col bg-base-300 rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/50 transition-all anime-card-hover shadow-xl"
                >
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent z-10" />
                    <img 
                      src={anime.thumbnail} 
                      alt={anime.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest orange-glow">
                        Ep {anime.episode}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-0 space-y-4">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {anime.title}
                    </h3>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                        <Clock size={14} className="text-primary" />
                        {anime.release_time}
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl text-white/30 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-[40px] border border-white/5 text-center px-6">
              <div className="p-6 bg-white/5 rounded-full mb-6">
                <Info size={48} className="text-white/20" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Schedule Found</h2>
              <p className="text-white/40 max-w-xs">
                There are no anime releases scheduled for {activeDay} yet. Please check back later!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
