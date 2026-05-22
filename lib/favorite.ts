export interface FavoriteItem {
  slug: string;
  title: string;
  thumbnail: string;
  type?: string;
  addedAt: number;
}

const FAVORITES_KEY = 'jasznime_favorites';

const isClient = typeof window !== 'undefined';

export function getFavorites(): FavoriteItem[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  if (!isClient) return false;
  const favorites = getFavorites();
  return favorites.some((item) => item.slug === slug);
}

export function toggleFavorite(item: Omit<FavoriteItem, 'addedAt'>): boolean {
  if (!isClient) return false;
  try {
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex((fav) => fav.slug === item.slug);
    let isAdded = false;

    if (existingIndex > -1) {
      // Remove from favorites
      favorites.splice(existingIndex, 1);
      isAdded = false;
    } else {
      // Add to favorites
      favorites.unshift({
        ...item,
        addedAt: Date.now(),
      });
      isAdded = true;
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event('favoritesChange'));
    return isAdded;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

export function removeFavorite(slug: string) {
  if (!isClient) return;
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((item) => item.slug !== slug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesChange'));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function clearFavorites() {
  if (!isClient) return;
  try {
    localStorage.removeItem(FAVORITES_KEY);
    window.dispatchEvent(new Event('favoritesChange'));
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}
