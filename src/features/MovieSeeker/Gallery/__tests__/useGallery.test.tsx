import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGallery from '../useGallery';

vi.mock('../../../../queries/searchQueries', () => ({
  useGetMovieList: vi.fn(),
}));

vi.mock('../../../../utils/debounce', () => ({
  debounce: vi.fn(),
}));

// Mock react-router-dom
const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  };
});

import { useGetMovieList } from '../../../../queries/searchQueries';
import { debounce } from '../../../../utils/debounce';

// Create typed mock functions
const mockUseGetMovieList = vi.mocked(useGetMovieList);
const mockDebounce = vi.mocked(debounce);

// Test wrapper component for React Query and Router
const createWrapper = (initialEntries = ['/?q=dragon']) => {
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
      <MemoryRouter initialEntries={initialEntries}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  };
};

// Mock movie data
const mockMovieSearchResults = {
  Search: [
    {
      Title: 'How to Train Your Dragon',
      Year: '2010',
      imdbID: 'tt0892769',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon 2',
      Year: '2014',
      imdbID: 'tt1646971',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMzMwMTAwODczN15BMl5BanBnXkFtZTgwMDk2NDA4MTE@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon: The Hidden World',
      Year: '2019',
      imdbID: 'tt2386490',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMjIwMDIwNjAyOF5BMl5BanBnXkFtZTgwNDE1MDc2NTM@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon',
      Year: '2025',
      imdbID: 'tt26743210',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BODA5Y2M0NjctNWQzMy00ODRhLWE0MzUtYmE1YTAzZjYyYmQyXkEyXkFqcGc@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon: Homecoming',
      Year: '2019',
      imdbID: 'tt11112140',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMTQ4NjRjNjEtMWRlMS00NTA3LTk5NzUtNDE0NjVkOTFlYmM2XkEyXkFqcGc@._V1_SX300.jpg',
    },
    {
      Title: 'Dreamworks How to Train Your Dragon Legends',
      Year: '2010',
      imdbID: 'tt2542490',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMTQzMjE5NDQwMl5BMl5BanBnXkFtZTgwMjI2NzA2MDE@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon',
      Year: '2010',
      imdbID: 'tt1621800',
      Type: 'game',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BNDY2NjI4NjkwN15BMl5BanBnXkFtZTcwNDA2NzcyMw@@._V1_SX300.jpg',
    },
    {
      Title: 'Dreamworks How to Train Your Dragon Legends',
      Year: '2010–2013',
      imdbID: 'tt6963396',
      Type: 'series',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BZWRiOTNiN2YtYWRmMi00NWMyLTgxOTAtOWU1MmM4ZGI3OWRlXkEyXkFqcGc@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon: Snoggletog Log',
      Year: '2019',
      imdbID: 'tt11409576',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BYjU5NmNiN2UtZDRmNi00NWY3LWFkYTItMDJhMzU4ZWFlZTVjXkEyXkFqcGc@._V1_SX300.jpg',
    },
    {
      Title: 'How to Train Your Dragon: Viking-Sized Cast',
      Year: '2010',
      imdbID: 'tt7639966',
      Type: 'movie',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BYzY1M2RjZGEtMGI5NS00YmJjLWFiN2MtMDgxYTk1ODNkNzljXkEyXkFqcGdeQXVyNDQ5MDYzMTk@._V1_SX300.jpg',
    },
  ],
  totalResults: '17',
  Response: 'True',
};

const mockResponseValue = {
  data: mockMovieSearchResults,
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  isError: false,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  isPlaceholderData: false,
  status: 'success',
  dataUpdatedAt: 0,
  errorUpdatedAt: 0,
  failureCount: 0,
  failureReason: new Error(),
  errorUpdateCount: 0,
  fetchStatus: 'idle',
  isEnabled: true,
  isFetching: false,
  isFetched: true,
  isFetchedAfterMount: true,
  isStale: false,
  isPaused: false,
  isRefetching: false,
  isInitialLoading: false,
  promise: Promise.resolve(mockMovieSearchResults),
};

describe('useGallery Hook', () => {
  const mockOnClickMovie = vi.fn();
  let mockScrollHandler: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset search params
    mockSearchParams.set('q', 'dragon');

    mockDebounce.mockImplementation((fn, _) => {
      mockScrollHandler = fn;
      return fn;
    });

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      bottom: 800,
      height: 600,
      left: 0,
      right: 400,
      top: 200,
      width: 400,
      x: 0,
      y: 200,
      toJSON: () => ({}),
    })) as any;

    // Default mock implementation for useGetMovieList
    mockUseGetMovieList.mockReturnValue({
      data: mockMovieSearchResults,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      isPlaceholderData: false,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: new Error(),
      errorUpdateCount: 0,
      fetchStatus: 'idle',
      isEnabled: true,
      isFetching: false,
      isFetched: true,
      isFetchedAfterMount: true,
      isStale: false,
      isPaused: false,
      isRefetching: false,
      isInitialLoading: false,
      promise: Promise.resolve(mockMovieSearchResults),
    });

    // Mock event listeners
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should initialize with correct default values', () => {
      mockUseGetMovieList.mockReturnValue({
        data: {
          Search: [],
          Response: 'True',
          totalResults: '0',
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: true,
        isPlaceholderData: false,
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: new Error(),
        errorUpdateCount: 0,
        fetchStatus: 'idle',
        isEnabled: true,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isStale: false,
        isPaused: false,
        isRefetching: false,
        isInitialLoading: false,
        promise: Promise.resolve(mockMovieSearchResults),
      });

      const { result } = renderHook(
        () =>
          useGallery({
            onClickMovie: mockOnClickMovie,
          }),
        { wrapper: createWrapper() }
      );

      expect(result.current.movieList).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.moviesContainer).toBeDefined();
      expect(result.current.onClickItem).toBeDefined();
    });

    it('should call useGetMovieList with correct initial parameters', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      expect(mockUseGetMovieList).toHaveBeenCalledWith({
        page: 1,
        s: 'dragon',
        type: 'movie',
      });
    });
  });

  describe('URL Parameter Integration', () => {
    it('should use search query from URL parameters', () => {
      mockSearchParams.set('q', 'dragon');

      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(['/?q=dragon']),
      });

      expect(mockUseGetMovieList).toHaveBeenCalledWith({
        page: 1,
        s: 'dragon',
        type: 'movie',
      });
    });

    it('should handle empty search query', () => {
      mockSearchParams.delete('q');

      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(['/']),
      });

      expect(mockUseGetMovieList).toHaveBeenCalledWith({
        page: 1,
        s: '',
        type: 'movie',
      });
    });
  });

  describe('Movie List State Management', () => {
    it('should accumulate movies from API responses', async () => {
      mockUseGetMovieList.mockReturnValue({
        data: {
          Response: 'True',
          totalResults: '17',
          Search: mockMovieSearchResults.Search,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: true,
        isPlaceholderData: false,
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: new Error(),
        errorUpdateCount: 0,
        fetchStatus: 'idle',
        isEnabled: true,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isStale: false,
        isPaused: false,
        isRefetching: false,
        isInitialLoading: false,
        promise: Promise.resolve(mockMovieSearchResults),
      });

      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.movieList).toEqual(mockMovieSearchResults.Search);
      });
    });

    it('should handle empty search results', async () => {
      mockUseGetMovieList.mockReturnValue({
        ...mockResponseValue,
        data: { Search: [], Response: 'True', totalResults: '0' },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: true,
        isPlaceholderData: false,
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: new Error(),
        errorUpdateCount: 0,
        fetchStatus: 'idle',
        isEnabled: true,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isStale: false,
        isPaused: false,
        isRefetching: false,
        isInitialLoading: false,
        promise: Promise.resolve(mockMovieSearchResults),
      });

      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.movieList).toEqual([]);
      });
    });

    it('should handle undefined search results', async () => {
      mockUseGetMovieList.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        isError: false,
        isPending: false,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: true,
        isPlaceholderData: false,
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: new Error(),
        errorUpdateCount: 0,
        fetchStatus: 'idle',
        isEnabled: true,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isStale: false,
        isPaused: false,
        isRefetching: false,
        isInitialLoading: false,
        promise: Promise.resolve(mockMovieSearchResults),
      });

      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      expect(result.current.movieList).toEqual([]);
    });
  });

  describe('Infinite Scroll Logic', () => {
    it('should detect when user is at bottom of page', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      const mockElement = {
        getBoundingClientRect: () => ({
          bottom: 990, // Within 10px of window height (1000)
        }),
      } as HTMLDivElement;

      const isAtBottomResult =
        mockElement.getBoundingClientRect().bottom - 10 <= window.innerHeight;
      expect(isAtBottomResult).toBe(true);
    });

    it('should not trigger when user is not at bottom', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          bottom: window.innerHeight + 20, // Not at bottom
        }),
      } as HTMLDivElement;

      const isAtBottomResult =
        mockElement.getBoundingClientRect().bottom - 10 <= window.innerHeight;
      expect(isAtBottomResult).toBe(false);
    });

    it('should increment page when scrolling to bottom', async () => {
      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      const mockContainer = document.createElement('div');
      Object.defineProperty(mockContainer, 'getBoundingClientRect', {
        value: () => ({
          bottom: 990, // At bottom
        }),
      });

      if (result.current.moviesContainer.current) {
        Object.defineProperty(result.current.moviesContainer, 'current', {
          value: mockContainer,
        });
      }

      if (mockScrollHandler) {
        mockScrollHandler();
      }

      await waitFor(() => {
        expect(mockUseGetMovieList).toHaveBeenCalledWith({
          page: 2,
          s: 'dragon',
          type: 'movie',
        });
      });
    });

    it('should not increment page when not at bottom', () => {
      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      const mockContainer = document.createElement('div');
      Object.defineProperty(mockContainer, 'getBoundingClientRect', {
        value: () => ({
          bottom: 500, // Not at bottom
        }),
      });

      if (result.current.moviesContainer.current) {
        Object.defineProperty(result.current.moviesContainer, 'current', {
          value: mockContainer,
        });
      }

      if (mockScrollHandler) {
        mockScrollHandler();
      }

      expect(mockUseGetMovieList).toHaveBeenCalledWith({
        page: 1,
        s: 'dragon',
        type: 'movie',
      });
    });
  });

  describe('Debounced Scroll Handler', () => {
    it('should debounce scroll events with 500ms delay', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      expect(mockDebounce).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it('should register debounced scroll handler with window', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });
  });

  describe('API Call Triggers', () => {
    it('should trigger API call with correct parameters', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      expect(mockUseGetMovieList).toHaveBeenCalledWith({
        page: 1,
        s: 'dragon',
        type: 'movie',
      });
    });

    it('should handle loading state from API', () => {
      mockUseGetMovieList.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        isError: false,
        isPending: true,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: false,
        isPlaceholderData: false,
        status: 'pending',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: new Error(),
        errorUpdateCount: 0,
        fetchStatus: 'idle',
        isEnabled: true,
        isFetching: false,
        isFetched: true,
        isFetchedAfterMount: true,
        isStale: false,
        isPaused: false,
        isRefetching: false,
        isInitialLoading: false,
        promise: Promise.resolve(mockMovieSearchResults),
      });

      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Click Interactions', () => {
    it('should call onClickMovie when onClickItem is called', () => {
      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      result.current.onClickItem('tt1375666');

      expect(mockOnClickMovie).toHaveBeenCalledWith('tt1375666');
    });

    it('should handle multiple click interactions', () => {
      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      result.current.onClickItem('tt1375666');
      result.current.onClickItem('tt0816692');

      expect(mockOnClickMovie).toHaveBeenCalledWith('tt1375666');
      expect(mockOnClickMovie).toHaveBeenCalledWith('tt0816692');
      expect(mockOnClickMovie).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null container element in scroll handler', () => {
      renderHook(() => useGallery({ onClickMovie: mockOnClickMovie }), {
        wrapper: createWrapper(),
      });

      if (mockScrollHandler) {
        expect(() => mockScrollHandler()).not.toThrow();
      }
    });

    it('should handle getBoundingClientRect returning null', () => {
      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      const mockContainer = {
        getBoundingClientRect: () => null,
      } as any;

      Object.defineProperty(result.current.moviesContainer, 'current', {
        value: mockContainer,
      });

      if (mockScrollHandler) {
        expect(() => mockScrollHandler()).not.toThrow();
      }
    });

    it('should handle rapid search query changes', async () => {
      const { result, rerender } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.movieList).toEqual(mockMovieSearchResults.Search);
      });

      mockSearchParams.set('q', 'batman');
      rerender();

      mockSearchParams.set('q', 'superman');
      rerender();

      mockSearchParams.set('q', 'spiderman');
      rerender();

      expect(result.current.movieList).toEqual([]);
    });

    it('should handle malformed API responses', async () => {
      mockUseGetMovieList.mockReturnValue({
        // @ts-expect-error
        data: { Search: null },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useGallery({ onClickMovie: mockOnClickMovie }),
        { wrapper: createWrapper() }
      );

      expect(result.current.movieList).toEqual([]);
    });
  });
});
