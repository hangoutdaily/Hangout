export interface UnsplashPhoto {
  id: string;
  altDescription: string;
  thumbUrl: string;
  regularUrl: string;
  photographerName: string;
  photographerLink: string;
}

interface UnsplashSearchResponse {
  results: Array<{
    id: string;
    alt_description: string | null;
    urls: {
      small: string;
      regular: string;
    };
    user: {
      name: string;
      username: string;
    };
  }>;
}

const DEFAULT_CATEGORY_IMAGE_QUERY = 'friends social meetup';
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';

const CATEGORY_IMAGE_QUERIES: Record<string, string> = {
  movies: 'cinema movie night friends',
  sports: 'sports game friends outdoor',
  walk: 'friends walking in city park',
  run: 'group running outdoors',
  coffee_tea: 'coffee shop friends chatting',
  travel: 'travel adventure friends',
  share_ride: 'road trip friends in car',
  lunch: 'friends having lunch table',
  dinner: 'friends dinner restaurant',
  brunch: 'weekend brunch friends',
  reading: 'book cafe reading group',
  volunteering: 'community volunteering group',
  comedy: 'comedy standup audience laughing',
  games: 'board games friends table',
  clubbing: 'friends dancing nightlife',
  fests_fairs: 'festival fair crowd lights',
  sightseeing: 'tourists sightseeing city',
  nightlife: 'night city friends nightlife',
  meetup: 'social meetup people talking',
  other: 'friends hanging out',
};

function normalizeCategory(category?: string) {
  if (!category) return '';
  return category.trim().toLowerCase();
}

export function getCategoryImageQuery(category?: string) {
  const normalizedCategory = normalizeCategory(category);
  if (!normalizedCategory) return DEFAULT_CATEGORY_IMAGE_QUERY;

  if (CATEGORY_IMAGE_QUERIES[normalizedCategory]) {
    return CATEGORY_IMAGE_QUERIES[normalizedCategory];
  }

  return normalizedCategory.replace(/_/g, ' ');
}

export function isUnsplashAccessKeyConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY);
}

export function getUnsplashSourceImage(query: string) {
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
}

export async function searchUnsplashPhotos({
  query,
  page = 1,
  perPage = 12,
}: {
  query: string;
  page?: number;
  perPage?: number;
}) {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [] as UnsplashPhoto[];

  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    orientation: 'landscape',
    content_filter: 'high',
  });

  const res = await fetch(`${UNSPLASH_SEARCH_URL}?${params.toString()}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load Unsplash photos');
  }

  const data = (await res.json()) as UnsplashSearchResponse;

  return data.results.map((photo) => ({
    id: photo.id,
    altDescription: photo.alt_description || 'Unsplash cover image',
    thumbUrl: photo.urls.small,
    regularUrl: photo.urls.regular,
    photographerName: photo.user.name,
    photographerLink: `https://unsplash.com/@${photo.user.username}?utm_source=hangout&utm_medium=referral`,
  }));
}
