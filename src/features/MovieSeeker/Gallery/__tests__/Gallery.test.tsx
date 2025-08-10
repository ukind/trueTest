import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Gallery from '../main';

vi.mock('../../Pane/usePane', () => ({
  default: vi.fn(),
}));

vi.mock('../useGallery', () => ({
  default: vi.fn(),
}));

import usePane from '../../Pane/usePane';
import useGallery from '../useGallery';

// Create typed mock functions
const mockUsePane = vi.mocked(usePane);
const mockUseGallery = vi.mocked(useGallery);

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  const theme = createTheme();

  return (
    <MemoryRouter initialEntries={['/?q=inception']}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

// Mock movie data
const mockMovieList = [
  {
    Title: 'Inception',
    Year: '2010',
    imdbID: 'tt1375666',
    Type: 'movie',
    Poster: 'https://example.com/inception.jpg',
  },
  {
    Title: 'Interstellar',
    Year: '2014',
    imdbID: 'tt0816692',
    Type: 'movie',
    Poster: 'https://example.com/interstellar.jpg',
  },
];

const mockMovieDetail = {
  Title: 'Inception',
  Year: '2010',
  Rated: 'PG-13',
  Released: '16 Jul 2010',
  Runtime: '148 min',
  Genre: 'Action, Adventure, Sci-Fi',
  Director: 'Christopher Nolan',
  Writer: 'Christopher Nolan',
  Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
  Plot: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.",
  Language: 'English, Japanese, French',
  Country: 'United States, United Kingdom',
  Awards: 'Won 4 Oscars. 159 wins & 220 nominations total',
  Poster:
    'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  Ratings: [
    {
      Source: 'Internet Movie Database',
      Value: '8.8/10',
    },
    {
      Source: 'Rotten Tomatoes',
      Value: '87%',
    },
    {
      Source: 'Metacritic',
      Value: '74/100',
    },
  ],
  Metascore: '74',
  imdbRating: '8.8',
  imdbVotes: '2,705,756',
  imdbID: 'tt1375666',
  Type: 'movie',
  DVD: 'N/A',
  BoxOffice: '$292,587,330',
  Production: 'N/A',
  Website: 'N/A',
  Response: 'True',
};

describe('Gallery Component', () => {
  const user = userEvent.setup();
  let mockMoviesContainer: HTMLDivElement;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock container ref
    mockMoviesContainer = document.createElement('div');
    Object.defineProperty(mockMoviesContainer, 'getBoundingClientRect', {
      value: vi.fn(() => ({
        bottom: 800,
        height: 600,
        left: 0,
        right: 400,
        top: 200,
        width: 400,
        x: 0,
        y: 200,
      })),
    });

    // Default mock implementations
    mockUsePane.mockReturnValue({
      onClickMovie: vi.fn(),
      onClose: vi.fn(),
      modalState: { isOpen: false, movieId: '' },
      isLoading: false,
      movieDetail: {
        Actors: '',
        Awards: '',
        BoxOffice: '',
        Country: '',
        DVD: '',
        Director: '',
        Genre: '',
        Language: '',
        Metascore: '',
        Plot: '',
        Production: '',
        Rated: '',
        Released: '',
        Response: '',
        Runtime: '',
        Title: '',
        Type: '',
        Writer: '',
        Website: '',
        imdbID: '',
        imdbRating: '',
        imdbVotes: '',
        Poster: '',
        Year: '',
        Ratings: [],
      },
    });

    mockUseGallery.mockReturnValue({
      isLoading: false,
      movieList: [],
      moviesContainer: { current: mockMoviesContainer },
      onClickItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Render', () => {
    it('should render Gallery component without crashing', () => {
      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByTestId('pane')).toBeInTheDocument();
    });

    it('should render movie loader when loading', () => {
      mockUseGallery.mockReturnValue({
        isLoading: true,
        movieList: [],
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByTestId('movie-loader')).toBeInTheDocument();
    });

    it('should not render movie loader when not loading', () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.queryByTestId('movie-loader')).not.toBeInTheDocument();
    });
  });

  describe('Movie List Rendering', () => {
    it('should render movie list when movies are available', () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('2010')).toBeInTheDocument();
      expect(screen.getByText('Interstellar')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });

    it('should render empty state when no movies available', () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: [],
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.queryByText('Inception')).not.toBeInTheDocument();
      expect(screen.queryByText('Interstellar')).not.toBeInTheDocument();
    });
  });

  describe('Click Interactions', () => {
    it('should call onClickItem when movie button is clicked', async () => {
      const mockOnClickItem = vi.fn();
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: mockOnClickItem,
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      const movieButton = screen.getByRole('button', { name: /inception/i });
      await user.click(movieButton);

      expect(mockOnClickItem).toHaveBeenCalledWith('tt1375666');
    });
  });

  describe('Image Error Handling', () => {
    it('should handle image error and show placeholder', async () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      const movieImage = screen.getByAltText('Inception');

      fireEvent.error(movieImage);

      await waitFor(() => {
        expect(movieImage).toHaveAttribute(
          'src',
          '/src/assets/images/placeholder.png'
        );
      });
    });

    it('should handle multiple image errors', async () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      const inceptionImage = screen.getByAltText('Inception');
      const interstellarImage = screen.getByAltText('Interstellar');

      // Simulate image errors
      fireEvent.error(inceptionImage);
      fireEvent.error(interstellarImage);

      await waitFor(() => {
        expect(inceptionImage).toHaveAttribute(
          'src',
          '/src/assets/images/placeholder.png'
        );
        expect(interstellarImage).toHaveAttribute(
          'src',
          '/src/assets/images/placeholder.png'
        );
      });
    });
  });

  describe('Pane Integration', () => {
    it('should show pane when modal is open', () => {
      mockUsePane.mockReturnValue({
        onClickMovie: vi.fn(),
        onClose: vi.fn(),
        modalState: { isOpen: true, movieId: 'tt1375666' },
        isLoading: false,
        movieDetail: mockMovieDetail,
      });

      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByTestId('pane-open')).toBeInTheDocument();
      expect(screen.getByTestId('movie-detail')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Title: Inception' })
      ).toBeInTheDocument();
    });

    it('should show loading in pane when movie detail is loading', () => {
      mockUsePane.mockReturnValue({
        onClickMovie: vi.fn(),
        onClose: vi.fn(),
        modalState: { isOpen: true, movieId: 'tt1375666' },
        isLoading: true,
        movieDetail: mockMovieDetail,
      });

      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByTestId('pane-loading')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show skeleton/loading state appropriately', () => {
      mockUseGallery.mockReturnValue({
        isLoading: true,
        movieList: [],
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.getByTestId('movie-loader')).toBeInTheDocument();
    });

    it('should not show loading when movies are available', () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(screen.queryByTestId('movie-loader')).not.toBeInTheDocument();
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle movie with missing poster', () => {
      const movieWithoutPoster = [
        {
          Title: 'Movie Without Poster',
          Year: '2023',
          imdbID: 'tt9999999',
          Type: 'movie',
          Poster: 'N/A',
        },
      ];

      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: movieWithoutPoster,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      const movieImage = screen.getByAltText('Movie Without Poster');
      expect(movieImage).toHaveAttribute('src', 'N/A');
    });

    it('should handle movie with special characters in title', () => {
      const movieWithSpecialChars = [
        {
          Title: 'Movie: The "Special" & Unique Film',
          Year: '2023',
          imdbID: 'tt8888888',
          Type: 'movie',
          Poster: 'https://example.com/special.jpg',
        },
      ];

      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: movieWithSpecialChars,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(
        screen.getByText('Movie: The "Special" & Unique Film')
      ).toBeInTheDocument();
    });

    it('should handle component unmounting cleanly', () => {
      mockUseGallery.mockReturnValue({
        isLoading: false,
        movieList: mockMovieList,
        moviesContainer: { current: mockMoviesContainer },
        onClickItem: vi.fn(),
      });

      const { unmount } = render(
        <TestWrapper>
          <Gallery />
        </TestWrapper>
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
