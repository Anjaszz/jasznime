import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParam?: string;
  queryValue?: string;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  baseUrl, 
  queryParam, 
  queryValue 
}) => {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (queryParam && queryValue) {
      params.set(queryParam, queryValue);
    }
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageButtons = () => {
    const buttons = [];
    const range = 1; // Number of pages to show around current page

    // Always show first two pages
    for (let i = 1; i <= Math.min(2, totalPages); i++) {
      buttons.push(renderButton(i));
    }

    // Ellipsis if needed after first two
    if (currentPage > 4) {
      buttons.push(<span key="dots-start" className="text-white/20 px-1 select-none">...</span>);
    }

    // Current page window
    const start = Math.max(3, currentPage - range);
    const end = Math.min(totalPages - 2, currentPage + range);

    for (let i = start; i <= end; i++) {
      if (i > 2 && i < totalPages - 1) {
        buttons.push(renderButton(i));
      }
    }

    // Ellipsis if needed before last two
    if (currentPage < totalPages - 3) {
      buttons.push(<span key="dots-end" className="text-white/20 px-1 select-none">...</span>);
    }

    // Always show last two pages
    if (totalPages > 2) {
      for (let i = Math.max(3, totalPages - 1); i <= totalPages; i++) {
        buttons.push(renderButton(i));
      }
    }

    return buttons;
  };

  const renderButton = (page: number) => (
    <Link
      key={page}
      href={getPageUrl(page)}
      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl font-bold transition-all border ${
        currentPage === page
          ? 'bg-primary text-white border-primary orange-glow scale-110 z-10'
          : 'bg-base-300 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
      }`}
    >
      {page}
    </Link>
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-16 mb-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-3 bg-base-300 hover:bg-primary text-white rounded-xl transition-all hover:scale-110 group border border-white/5"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div className="p-3 bg-base-300/50 text-white/20 rounded-xl border border-white/5 cursor-not-allowed">
          <ChevronLeft size={20} />
        </div>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {renderPageButtons()}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-3 bg-base-300 hover:bg-primary text-white rounded-xl transition-all hover:scale-110 group border border-white/5"
        >
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <div className="p-3 bg-base-300/50 text-white/20 rounded-xl border border-white/5 cursor-not-allowed">
          <ChevronRight size={20} />
        </div>
      )}
    </div>
  );
};



export default Pagination;
