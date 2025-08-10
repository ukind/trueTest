import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Search } from '../../../../services/Search/types';
import Pane from '../main';

// Mock Material-UI components using vi.mock with factory function
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');

  // Mock Modal component
  const MockModal = vi.fn(({ open, onClose, children, ...props }) => {
    if (!open) return null;

    return (
      <div
        data-testid="modal-backdrop"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        tabIndex={-1}
        {...props}
      >
        <div data-testid="modal-content">{children}</div>
      </div>
    );
  });

  // Mock Skeleton component
  const MockSkeleton = ({
    variant,
    width,
    height,
    animation,
    ...props
  }: any) => (
    <div
      data-testid={`skeleton-${variant}`}
      data-width={width}
      data-height={height}
      data-animation={animation}
      {...props}
    >
      Loading skeleton
    </div>
  );

  return {
    ...actual,
    Modal: MockModal,
    Skeleton: MockSkeleton,
  };
});

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

// Mock movie data
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

describe('Pane Component', () => {
  const user = userEvent.setup();
  let mockOnClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnClose = vi.fn();

    // Setup focus trap for accessibility testing
    document.body.innerHTML = '';
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal-root');
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Modal Behavior', () => {
    it('should not render modal when isOpen is false', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={false}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('should not call onClose when clicking modal content', async () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      const content = screen.getByTestId('modal-content');
      await user.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should render skeleton loading components when isLoading is true', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={undefined}
            isLoading={true}
          />
        </TestWrapper>
      );

      // Check for image skeleton
      const imageSkeleton = screen.getByTestId('skeleton-rectangular');
      expect(imageSkeleton).toBeInTheDocument();
      expect(imageSkeleton).toHaveAttribute('data-width', '400');
      expect(imageSkeleton).toHaveAttribute('data-height', '450');
      expect(imageSkeleton).toHaveAttribute('data-animation', 'wave');

      // Check for text skeletons
      const textSkeletons = screen.getAllByTestId('skeleton-text');
      expect(textSkeletons).toHaveLength(4);

      // Verify different skeleton sizes
      expect(textSkeletons[0]).toHaveAttribute('data-width', '100%');
      expect(textSkeletons[1]).toHaveAttribute('data-width', '100%');
      expect(textSkeletons[2]).toHaveAttribute('data-width', '60%');
      expect(textSkeletons[3]).toHaveAttribute('data-height', '80');
    });

    it('should not render skeletons when isLoading is false', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(
        screen.queryByTestId('skeleton-rectangular')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('skeleton-text')).not.toBeInTheDocument();
    });

    it('should render skeletons even when movieDetail is provided if isLoading is true', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={true}
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('skeleton-rectangular')).toBeInTheDocument();
      expect(screen.getAllByTestId('skeleton-text')).toHaveLength(4);

      // Movie details should not be visible when loading
      expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    });
  });

  describe('Movie Detail Display', () => {
    it('should render movie details when provided and not loading', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Check movie title
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('Title:')).toBeInTheDocument();

      // Check genre
      expect(screen.getByText('Action, Sci-Fi, Thriller')).toBeInTheDocument();
      expect(screen.getByText('Genre:')).toBeInTheDocument();

      // Check metascore
      expect(screen.getByText('74')).toBeInTheDocument();
      expect(screen.getByText('Score:')).toBeInTheDocument();

      // Check plot
      expect(
        screen.getByText(/A thief who steals corporate secrets/)
      ).toBeInTheDocument();
    });

    it('should render movie poster with correct attributes', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      const posterImage = screen.getByAltText('Inception');
      expect(posterImage).toBeInTheDocument();
      expect(posterImage).toHaveAttribute(
        'src',
        'https://example.com/inception.jpg'
      );
      expect(posterImage).toHaveAttribute('srcSet', '');
    });

    it('should render movie poster with fallback alt text when title is missing', () => {
      const movieWithoutTitle = { ...mockMovieDetail, Title: '' };

      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={movieWithoutTitle}
            isLoading={false}
          />
        </TestWrapper>
      );

      const posterImage = screen.getByAltText('Movie poster');
      expect(posterImage).toBeInTheDocument();
    });

    it('should handle missing movie detail gracefully', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={undefined}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Should not crash and should render empty content
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle partial movie detail data', () => {
      const partialMovieDetail = {
        ...mockMovieDetail,
        Genre: '',
        Metascore: '',
        Plot: '',
      };

      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={partialMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Title should still be rendered
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('Title:')).toBeInTheDocument();

      // Missing fields should not crash the component
      expect(screen.getByText('Genre:')).toBeInTheDocument();
      expect(screen.getByText('Score:')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null movieDetail', () => {
      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={undefined}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(() => screen.getByText('Title:')).not.toThrow();
    });

    it('should handle empty string values in movieDetail', () => {
      const emptyMovieDetail = {
        ...mockMovieDetail,
        Title: '',
        Genre: '',
        Metascore: '',
        Plot: '',
        Poster: '',
      };

      render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={emptyMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Title:')).toBeInTheDocument();
      expect(screen.getByText('Genre:')).toBeInTheDocument();
    });

    it('should handle multiple rapid open/close cycles', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Pane
            isOpen={false}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Rapid open/close cycles
      for (let i = 0; i < 5; i++) {
        rerender(
          <TestWrapper>
            <Pane
              isOpen={true}
              onClose={mockOnClose}
              movieDetail={mockMovieDetail}
              isLoading={false}
            />
          </TestWrapper>
        );

        rerender(
          <TestWrapper>
            <Pane
              isOpen={false}
              onClose={mockOnClose}
              movieDetail={mockMovieDetail}
              isLoading={false}
            />
          </TestWrapper>
        );
      }

      expect(() => screen.queryByRole('dialog')).not.toThrow();
    });

    it('should handle component unmounting cleanly', () => {
      const { unmount } = render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly with both loading and movieDetail states', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={undefined}
            isLoading={true}
          />
        </TestWrapper>
      );

      // Should show skeletons initially
      expect(screen.getByTestId('skeleton-rectangular')).toBeInTheDocument();

      // Simulate loading completion
      rerender(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Should now show movie details
      await waitFor(() => {
        expect(
          screen.queryByTestId('skeleton-rectangular')
        ).not.toBeInTheDocument();
        expect(screen.getByText('Inception')).toBeInTheDocument();
      });
    });

    it('should maintain accessibility during state transitions', async () => {
      const { rerender } = render(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={undefined}
            isLoading={true}
          />
        </TestWrapper>
      );

      // Modal should be accessible during loading
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');

      rerender(
        <TestWrapper>
          <Pane
            isOpen={true}
            onClose={mockOnClose}
            movieDetail={mockMovieDetail}
            isLoading={false}
          />
        </TestWrapper>
      );

      // Modal should remain accessible after loading
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute(
          'aria-modal',
          'true'
        );
      });
    });
  });
});
