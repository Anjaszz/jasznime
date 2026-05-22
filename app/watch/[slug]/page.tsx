'use client';

import React, { useState, useEffect } from 'react';
import { getWatch, WatchResponse } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Play, Download, Server, ChevronLeft, ChevronRight, Share2, Info } from 'lucide-react';
import Link from 'next/link';
import { updateEpisodeInHistory } from '@/lib/history';

export default function WatchPage() {
  const { slug } = useParams();
  const [data, setData] = useState<WatchResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState(0);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getWatch(slug as string)
        .then((res) => {
          if (res.status === 'success') {
            setData(res.data);
            updateEpisodeInHistory(slug as string, res.data.title);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-white/50 animate-pulse font-medium">Menyiapkan streaming Anda...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-xl text-white/50">Gagal memuat streaming. Silakan coba lagi.</p>
        <Link href="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content (Player) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-2 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-primary">Beranda</Link>
            <ChevronRight size={12} />
            <span className="text-white/80 line-clamp-1">{data.title}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
            {data.title}
          </h1>

          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 orange-glow">
            {data.streaming_servers[activeServer] && (
              <iframe
                src={data.streaming_servers[activeServer].url}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                scrolling="no"
                frameBorder="0"
              ></iframe>
            )}
          </div>

          {/* Controls & Servers */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {data.prev_episode && (
                <Link 
                  href={`/watch/${data.prev_episode}`}
                  className="bg-base-300 hover:bg-primary px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-all text-sm"
                >
                  <ChevronLeft size={18} /> Sebelumnya
                </Link>
              )}
              {data.next_episode && (
                <Link 
                  href={`/watch/${data.next_episode}`}
                  className="bg-primary hover:bg-primary/80 px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-all text-sm orange-glow"
                >
                  Berikutnya <ChevronRight size={18} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all">
                <Share2 size={20} />
              </button>
              <button className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all">
                <Info size={20} />
              </button>
            </div>
          </div>

          {/* Server Selection */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Server size={18} className="text-primary" /> Pilih Server
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.streaming_servers.map((server, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveServer(idx)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeServer === idx 
                      ? 'bg-primary text-white orange-glow' 
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {server.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/30 mt-4 italic">
              *Jika video tidak dimuat, coba ganti server.
            </p>
          </div>
        </div>

        {/* Sidebar (Download Links) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
              <Download size={18} className="text-primary" /> Unduh
            </h3>
            
            <div className="space-y-6">
              {data.download_links.map((dl, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      {dl.quality}
                    </span>
                    <div className="h-[1px] flex-grow bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dl.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5 p-2 rounded-lg text-[11px] font-bold text-center transition-all"
                      >
                        {link.provider}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl">
            <h4 className="text-primary font-bold text-sm mb-2 flex items-center gap-2">
              <Info size={16} /> Tips Cepat
            </h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Gunakan "HD Hemat" atau "Pixel HD" untuk pengalaman terbaik. Pemblokir iklan direkomendasikan untuk pemutar pihak ketiga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
