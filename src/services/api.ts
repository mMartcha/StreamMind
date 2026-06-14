import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "axios";

import { ContentItem } from "@/src/data/content";

export const AUTH_TOKEN_STORAGE_KEY = "@streammind:auth_token";
export const AUTH_USER_STORAGE_KEY = "@streammind:auth_user";

const LOCAL_API_BASE_URL = "http://10.0.2.2:3333";

function resolveApiBaseUrl() {
  const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

  if (envApiBaseUrl) {
    return envApiBaseUrl.replace(/\/+$/, "");
  }

  if (__DEV__) {
    return LOCAL_API_BASE_URL;
  }

  throw new Error(
    "EXPO_PUBLIC_API_BASE_URL não configurada. Configure a URL do backend no EAS antes de gerar a APK.",
  );
}

export const API_BASE_URL = resolveApiBaseUrl();

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export type CatalogItem = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  voteAverage: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetails = CatalogItem & {
  mediaType: "movie";
  genres: Genre[];
  runtime: number;
  status: string;
};

export type TvDetails = CatalogItem & {
  mediaType: "tv";
  genres: Genre[];
  numberOfSeasons: number;
  numberOfEpisodes: number;
  status: string;
};

export type StreamingProvider = {
  id: number;
  name: string;
  logoUrl: string;
};

export type ProvidersResponse = {
  country: string;
  flatrate: StreamingProvider[];
  rent: StreamingProvider[];
  buy: StreamingProvider[];
  ads: StreamingProvider[];
  free: StreamingProvider[];
};

export type CatalogContentItem = ContentItem & {
  tmdbId: number;
  mediaType: CatalogItem["mediaType"];
  releaseDate: string;
  voteAverage: number;
  status?: string;
};

export type UserTitleStatus = "FAVORITE" | "WATCHLIST" | "WATCHED";

export type UserTitleMediaType = "MOVIE" | "TV";

export type UserTitleItem = {
  id: string;
  tmdbId: number;
  mediaType: UserTitleMediaType;
  status: UserTitleStatus;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  voteAverage: number;
};

export type CreateUserTitlePayload = {
  tmdbId: number;
  mediaType: UserTitleMediaType;
  status: UserTitleStatus;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  voteAverage: number;
};

export type UserListStats = {
  favorites: number;
  watchlist: number;
  watched: number;
};

export type RemoveUserListItemByTitleParams = {
  tmdbId: number;
  mediaType: UserTitleMediaType;
  status: UserTitleStatus;
};

export async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const headers = new Headers(options?.headers);

  if (options?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function getTrending() {
  return request<CatalogItem[]>("/catalog/trending");
}

export function searchCatalog(query: string) {
  return request<CatalogItem[]>(
    `/catalog/search?query=${encodeURIComponent(query)}`,
  );
}

export function getMovieDetails(id: number) {
  return request<MovieDetails>(`/catalog/movie/${id}`);
}

export function getTvDetails(id: number) {
  return request<TvDetails>(`/catalog/tv/${id}`);
}

export function getMovieProviders(id: number) {
  return request<ProvidersResponse>(`/catalog/movie/${id}/providers`);
}

export function getTvProviders(id: number) {
  return request<ProvidersResponse>(`/catalog/tv/${id}/providers`);
}

export function getUserLists(status?: UserTitleStatus) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return request<UserTitleItem[]>(`/user-lists${query}`);
}

export function addUserListItem(data: CreateUserTitlePayload) {
  return request<UserTitleItem>("/user-lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function removeUserListItemById(id: string) {
  return request<void>(`/user-lists/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function removeUserListItemByTitle(
  params: RemoveUserListItemByTitleParams,
) {
  const searchParams = new URLSearchParams({
    tmdbId: String(params.tmdbId),
    mediaType: params.mediaType,
    status: params.status,
  });

  return request<void>(`/user-lists?${searchParams.toString()}`, {
    method: "DELETE",
  });
}

export function getUserListStats() {
  return request<UserListStats>("/user-lists/stats");
}

export function toUserTitleMediaType(
  mediaType: CatalogItem["mediaType"],
): UserTitleMediaType {
  return mediaType === "movie" ? "MOVIE" : "TV";
}

export function toCatalogMediaType(
  mediaType: UserTitleMediaType,
): CatalogItem["mediaType"] {
  return mediaType === "MOVIE" ? "movie" : "tv";
}

export function toContentItem(
  item: CatalogItem | MovieDetails | TvDetails,
): CatalogContentItem {
  const year = Number(item.releaseDate?.slice(0, 4)) || 0;
  const genres =
    "genres" in item ? item.genres.map((genre) => genre.name) : ["Catalogo"];
  const duration =
    item.mediaType === "movie" && "runtime" in item
      ? `${item.runtime} min`
      : item.mediaType === "tv" && "numberOfSeasons" in item
        ? `${item.numberOfSeasons} temporada${
            item.numberOfSeasons === 1 ? "" : "s"
          }`
        : item.mediaType === "movie"
          ? "Filme"
          : "Serie";

  return {
    id: `${item.mediaType}-${item.tmdbId}`,
    tmdbId: item.tmdbId,
    mediaType: item.mediaType,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage,
    status: "status" in item ? item.status : undefined,
    title: item.title,
    year,
    duration,
    genre: genres.length > 0 ? genres : ["Catalogo"],
    imdb: Number(item.voteAverage.toFixed(1)),
    type: item.mediaType === "movie" ? "Filme" : "Serie",
    poster: item.posterUrl,
    backdrop: item.backdropUrl || item.posterUrl,
    shortSynopsis: item.overview,
    aiSynopsis: item.overview,
    cast: [],
    availableOn: [],
  };
}

export function toContentItemFromUserList(
  item: UserTitleItem,
): CatalogContentItem {
  const mediaType = toCatalogMediaType(item.mediaType);
  const year = Number(item.releaseDate?.slice(0, 4)) || 0;

  return {
    id: `${mediaType}-${item.tmdbId}`,
    tmdbId: item.tmdbId,
    mediaType,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage,
    status: item.status,
    title: item.title,
    year,
    duration: mediaType === "movie" ? "Filme" : "Serie",
    genre: ["Catalogo"],
    imdb: Number(item.voteAverage?.toFixed(1)) || 0,
    type: mediaType === "movie" ? "Filme" : "Serie",
    poster: item.posterUrl,
    backdrop: item.backdropUrl || item.posterUrl,
    shortSynopsis: item.overview,
    aiSynopsis: item.overview,
    cast: [],
    availableOn: [],
  };
}

export function parseContentRouteId(routeId?: string) {
  const [mediaType, rawId] = routeId?.split("-") ?? [];
  const tmdbId = Number(rawId);

  if (
    (mediaType === "movie" || mediaType === "tv") &&
    Number.isFinite(tmdbId)
  ) {
    return { mediaType, tmdbId } as const;
  }

  return null;
}
