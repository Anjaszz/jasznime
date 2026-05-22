import React from 'react';
import { Play, Globe, MessageSquare, Share2 } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-white/5 pt-12 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Play className="text-white fill-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                JASZ<span className="text-primary">NIME</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Destinasi terbaik untuk streaming anime. Tonton anime favorit Anda dalam kualitas tinggi, 
              sepenuhnya gratis. Pantau daftar tontonan Anda dan jangan pernah melewatkan pembaruan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
              <li><Link href="/schedule" className="hover:text-primary transition-colors">Jadwal</Link></li>
              <li><Link href="/genres" className="hover:text-primary transition-colors">Genre</Link></li>
              <li><Link href="/search" className="hover:text-primary transition-colors">Cari</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-6">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-primary/20 hover:text-primary transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-primary/20 hover:text-primary transition-all">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-primary/20 hover:text-primary transition-all">
                <Share2 size={20} />
              </a>
            </div>
          </div>
        </div>


        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © 2026 JASZNIME. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="#" className="hover:text-white/60">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white/60">Syarat dan Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
