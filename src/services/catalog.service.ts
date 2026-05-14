import { api, type CatalogItem, type MovieDetails } from './api';

export async function getTrending(): Promise<CatalogItem[]> {
  const response = await api.get<CatalogItem[]>('/catalog/trending');

  return response.data;
}

export async function getMovieById(tmdbId: number): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(`/catalog/movie/${tmdbId}`);

  return response.data;
}
