import { api, type MovieDetails } from './api';

export async function getMovieById(tmdbId: number): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(`/catalog/movie/${tmdbId}`);

  return response.data;
}
