export interface WatchHistoryItem {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  episodeTitle?: string;
  episodeSlug?: string;
  lastViewed: number;
}

const WATCH_HISTORY_KEY = 'jasznime_watch_history';
const SEARCH_HISTORY_KEY = 'jasznime_search_history';

// Helper to check if window is defined (client-side)
const isClient = typeof window !== 'undefined';

export function getWatchHistory(): WatchHistoryItem[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(WATCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading watch history:', error);
    return [];
  }
}

export function addToWatchHistory(item: Omit<WatchHistoryItem, 'lastViewed'>) {
  if (!isClient) return;
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex((h) => h.slug === item.slug);

    const newItem: WatchHistoryItem = {
      ...item,
      lastViewed: Date.now(),
    };

    if (existingIndex > -1) {
      // Keep existing episode info if not provided in the new item
      const existingItem = history[existingIndex];
      newItem.episodeTitle = item.episodeTitle || existingItem.episodeTitle;
      newItem.episodeSlug = item.episodeSlug || existingItem.episodeSlug;
      newItem.type = item.type || existingItem.type;
      newItem.thumbnail = item.thumbnail || existingItem.thumbnail;
      
      // Remove from old position
      history.splice(existingIndex, 1);
    }

    // Add to the beginning of the array
    history.unshift(newItem);

    // Limit to 10 items
    if (history.length > 10) {
      history.pop();
    }

    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    
    // Dispatch custom event to notify components (like Navbar) of change
    window.dispatchEvent(new Event('watchHistoryChange'));
  } catch (error) {
    console.error('Error adding to watch history:', error);
  }
}

export function updateEpisodeInHistory(episodeSlug: string, episodeTitle: string) {
  if (!isClient) return;
  try {
    const history = getWatchHistory();
    
    // Attempt to guess the anime slug from the episode slug
    // e.g. "solo-leveling-episode-1" -> "solo-leveling"
    // e.g. "solo-leveling-season-2-episode-1" -> "solo-leveling-season-2"
    const guessedAnimeSlug = episodeSlug.replace(/-episode-\d+.*$/, '');
    
    // Find matching anime in history
    let existingItem = history.find(
      (h) => h.slug === guessedAnimeSlug || episodeSlug.startsWith(h.slug)
    );

    if (existingItem) {
      // Update existing item
      addToWatchHistory({
        slug: existingItem.slug,
        title: existingItem.title,
        thumbnail: existingItem.thumbnail,
        type: existingItem.type,
        episodeSlug,
        episodeTitle,
      });
    } else {
      // If it doesn't exist, create a new history item
      const guessedAnimeTitle = episodeTitle.split(' - ')[0] || episodeTitle;
      
      addToWatchHistory({
        slug: guessedAnimeSlug,
        title: guessedAnimeTitle,
        thumbnail: '', // Will fall back to placeholder in UI
        type: 'Anime',
        episodeSlug,
        episodeTitle,
      });
    }
  } catch (error) {
    console.error('Error updating episode in watch history:', error);
  }
}

export function clearWatchHistory() {
  if (!isClient) return;
  try {
    localStorage.removeItem(WATCH_HISTORY_KEY);
    window.dispatchEvent(new Event('watchHistoryChange'));
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
}

export function getSearchHistory(): string[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

export function addToSearchHistory(query: string) {
  if (!isClient) return;
  const trimmed = query.trim();
  if (!trimmed) return;

  try {
    const history = getSearchHistory();
    const existingIndex = history.indexOf(trimmed);

    if (existingIndex > -1) {
      history.splice(existingIndex, 1);
    }

    history.unshift(trimmed);

    // Limit to 5 items
    if (history.length > 5) {
      history.pop();
    }

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('searchHistoryChange'));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
}

export function removeFromSearchHistory(query: string) {
  if (!isClient) return;
  try {
    const history = getSearchHistory();
    const updated = history.filter((q) => q !== query);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('searchHistoryChange'));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
}

export function clearSearchHistory() {
  if (!isClient) return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    window.dispatchEvent(new Event('searchHistoryChange'));
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}
