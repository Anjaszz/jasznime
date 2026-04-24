const API_BASE_URL = 'https://scripapi.web.id/gateway.php/anime';

export interface Anime {
  slug: string;
  title: string;
  thumbnail: string;
  type: string;
  latest_episode?: string;
  episode?: string;
  release_time?: string;
}

export interface HomeResponse {
  status: string;
  data: {
    page: number;
    total_pages: number;
    anime: Anime[];
  };
}

export interface DetailResponse {
  status: string;
  data: {
    title: string;
    thumbnail: string;
    synopsis: string;
    info: {
      status: string;
      studio: string;
      dirilis: string;
      durasi: string;
      tipe: string;
      total_episode: string;
      fansub: string;
      censor: string;
      director: string;
      diposting_oleh: string;
      diperbarui_pada: string;
      genres: string[];
    };
    episodes: {
      slug: string;
      number: string;
      title: string;
      date: string;
    }[];
  };
}

export interface WatchResponse {
  status: string;
  data: {
    title: string;
    streaming_servers: {
      name: string;
      type: string;
      url: string;
    }[];
    download_links: {
      quality: string;
      links: {
        provider: string;
        url: string;
      }[];
    }[];
    prev_episode: string | null;
    next_episode: string | null;
  };
}

export interface ScheduleResponse {
  status: string;
  data: {
    [key: string]: Anime[];
  };
}

export interface Genre {
  name: string;
  slug: string;
  count: string;
}

export interface GenresResponse {
  status: string;
  data: Genre[];
}

const fetchData = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (res.status === 429) {
      console.error('Rate limited (429). Returning empty data.');
      return { status: 'error', message: 'Too many requests' };
    }

    if (!res.ok) {
      return { status: 'error', message: `HTTP Error: ${res.status}` };
    }

    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { status: 'error', message: 'Internal Server Error' };
  }
};

export const getHome = async (page = 1): Promise<HomeResponse> => {
  return fetchData(`/home?page=${page}`, { next: { revalidate: 3600 } });
};

export const getDetail = async (slug: string): Promise<DetailResponse> => {
  return fetchData(`/detail?slug=${slug}`, { next: { revalidate: 3600 } });
};

export const getWatch = async (slug: string): Promise<WatchResponse> => {
  return fetchData(`/watch?slug=${slug}`, { cache: 'no-store' });
};

export const searchAnime = async (q: string, page = 1): Promise<HomeResponse> => {
  return fetchData(`/search?q=${q}&page=${page}`, { next: { revalidate: 3600 } });
};

export const getSchedule = async (): Promise<ScheduleResponse> => {
  return fetchData('/schedule', { next: { revalidate: 3600 } });
};

export const getGenres = async (): Promise<GenresResponse> => {
  return fetchData('/genres', { next: { revalidate: 86400 } });
};

export const getAnimeByGenre = async (name: string, page = 1): Promise<HomeResponse> => {
  return fetchData(`/genres?name=${name}&page=${page}`, { next: { revalidate: 3600 } });
};

