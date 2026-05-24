import { api } from "./api";

export type RecommendationMediaType = "movie" | "tv";

export type RecommendationSelectedMovie = {
  tmdbId: number;
  mediaType: RecommendationMediaType;
  title: string;
};

export type GenerateRecommendationsRequest = {
  selectedMovies: RecommendationSelectedMovie[];
  desiredGenre: string;
  desiredMediaType: RecommendationMediaType;
};

export type RecommendationItem = {
  tmdbId: number;
  mediaType: RecommendationMediaType;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  releaseDate: string | null;
  voteAverage: number | null;
  reason: string;
};

export type GenerateRecommendationsResponse = {
  recommendations: RecommendationItem[];
};

export async function generateRecommendations(
  payload: GenerateRecommendationsRequest,
): Promise<GenerateRecommendationsResponse> {
  const response = await api.post<GenerateRecommendationsResponse>(
    "/recommendations",
    payload,
  );

  return response.data;
}
