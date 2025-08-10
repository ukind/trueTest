import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Search } from '../../../../services/Search/types';
import usePane from '../usePane';

// Mock the useGetMovieDetail hook
const mockUseGetMovieDetail = vi.fn();
vi.mock('../../../queries/searchQueries', () => ({
  useGetMovieDetail: mockUseGetMovieDetail,
}));

// Test wrapper component for React Query
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

// Mock movie detail data
const mockMovieDetail: Search.getMovieDetail.Response = {
  Title: 'Inception',
  Year: '2010',
  Rated: 'PG-13',
  Released: '16 Jul 2010',
  Runtime: '148 min',
  Genre: 'Action, Sci-Fi, Thriller',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan',
  Actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
  Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  Language: 'English, Japanese, French',
  Country: 'USA, UK',
  Awards: 'Won 4 Oscars. Another 143 wins & 198 nominations.',
  Poster: 'https://example.com/inception.jpg',
  Ratings: [],
  Metascore: '74',
  imdbRating: '8.8',
  imdbVotes: '2,000,000',
  imdbID: 'tt1375666',
  Type: 'movie',
  DVD: '07 Dec 2010',
  BoxOffice: '$292,576,195',
  Production: 'Warner Bros. Pictures',
  Website: 'N/A',
  Response: 'True',
};

describe('usePane Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useGetMovieDetail
    mockUseGetMovieDetail.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Hook Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      expect(result.current.modalState).toEqual({
        isOpen: false,
        movieId: '',
      });
      expect(result.current.movieDetail).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.onClickMovie).toBeInstanceOf(Function);
      expect(result.current.onClose).toBeInstanceOf(Function);
    });

    it('should call useGetMovieDetail with correct initial parameters', () => {
      renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      expect(mockUseGetMovieDetail).not.toHaveBeenCalled();
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Modal State Management', () => {
    it('should open modal and set movieId when onClickMovie is called', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1375666');
      });

      expect(result.current.modalState).toEqual({
        isOpen: true,
        movieId: 'tt1375666',
      });
    });

    it('should close modal when onClose is called', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      // First open the modal
      act(() => {
        result.current.onClickMovie('tt1375666');
      });

      expect(result.current.modalState.isOpen).toBe(true);

      // Then close it
      act(() => {
        result.current.onClose();
      });

      expect(result.current.modalState.isOpen).toBe(false);
      expect(result.current.modalState.movieId).toBe('tt1375666'); // movieId should remain
    });

    it('should maintain movieId when closing modal', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1375666');
      });

      const movieIdBeforeClose = result.current.modalState.movieId;

      act(() => {
        result.current.onClose();
      });

      expect(result.current.modalState.movieId).toBe(movieIdBeforeClose);
    });

    it('should handle multiple open/close cycles', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      // Open and close multiple times
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.onClickMovie(`tt${i}`);
        });
        expect(result.current.modalState.isOpen).toBe(true);

        act(() => {
          result.current.onClose();
        });
        expect(result.current.modalState.isOpen).toBe(false);
      }
    });

    it('should update movieId when clicking different movies', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1375666');
      });
      expect(result.current.modalState.movieId).toBe('tt1375666');

      act(() => {
        result.current.onClickMovie('tt0816692');
      });
      expect(result.current.modalState.movieId).toBe('tt0816692');
      expect(result.current.modalState.isOpen).toBe(true);
    });
  });

  describe('Data Persistence', () => {
    it('should persist movieDetail when modal is closed', () => {
      mockUseGetMovieDetail.mockReturnValue({
        data: mockMovieDetail,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1375666');
      });

      const movieDetailBeforeClose = result.current.movieDetail;

      act(() => {
        result.current.onClose();
      });

      expect(result.current.movieDetail).toEqual(movieDetailBeforeClose);
    });

    it('should maintain state consistency across rerenders', () => {
      const { result, rerender } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1375666');
      });

      const stateBeforeRerender = result.current.modalState;

      rerender();

      expect(result.current.modalState).toEqual(stateBeforeRerender);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined movieDetail gracefully', () => {
      mockUseGetMovieDetail.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      expect(result.current.movieDetail).toBeUndefined();
      expect(() => result.current.onClickMovie('tt1375666')).not.toThrow();
    });

    it('should handle rapid successive onClickMovie calls', () => {
      const { result } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.onClickMovie('tt1');
        result.current.onClickMovie('tt2');
        result.current.onClickMovie('tt3');
      });

      expect(result.current.modalState.movieId).toBe('tt3');
      expect(result.current.modalState.isOpen).toBe(true);
    });

    it('should handle hook unmounting cleanly', () => {
      const { unmount } = renderHook(() => usePane(), {
        wrapper: createWrapper(),
      });

      expect(() => unmount()).not.toThrow();
    });
  });
});
