import { useQuery } from '@tanstack/react-query';
import SearchService from '../services/Search/searchService';
import type { Search } from '../services/Search/types';
import { sleep } from '../utils/sleep';

export const useFindSuggestion = (
  payload: Search.getMovies.Payload,
  debounce = 500
) => {
  return useQuery({
    queryKey: ['search', 'suggestions', JSON.stringify(payload)],
    queryFn: async ({ signal }) => {
      await sleep(debounce);
      if (!signal?.aborted) {
        return SearchService.findSuggestion(payload);
      }
    },
    enabled: !!payload.s,
  });
};

export const useGetMovieList = (payload: Search.getMovies.Payload) => {
  return useQuery({
    queryKey: ['search', 'movies', JSON.stringify(payload)],
    queryFn: async ({ signal }) => {
      await sleep(500);
      if (!signal?.aborted) {
        return SearchService.searchMovies(payload);
      }
    },
    enabled: !!payload.s,
  });
};

export const useGetMovieDetail = (payload: Search.getMovieDetail.Payload) => {
  return useQuery({
    queryKey: ['movie', 'detail', JSON.stringify(payload)],
    queryFn: async ({ signal }) => {
      await sleep(500);
      if (!signal?.aborted) {
        return SearchService.getMoviesDetail(payload);
      }
    },
    enabled: !!payload.i,
  });
};
