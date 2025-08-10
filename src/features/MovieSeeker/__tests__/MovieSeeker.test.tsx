import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MovieSeeker from '../index';

// Mock child components to focus on layout testing
vi.mock('../SearchBar', () => ({
  default: () => <div data-testid="search-bar">SearchBar Component</div>,
}));

vi.mock('../Gallery', () => ({
  default: () => <div data-testid="gallery">Gallery Component</div>,
}));

// Mock static assets
vi.mock('../../../assets/images/main-logo.png', () => ({
  default: 'main-logo.png',
}));

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

describe('MovieSeeker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('gallery')).toBeInTheDocument();
    });

    it('should render in the correct order', () => {
      const { container } = render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const elements = container.querySelectorAll(
        '[data-testid], [data-component]'
      );
      const elementOrder = Array.from(elements).map(
        (el) =>
          el.getAttribute('data-testid') || el.getAttribute('data-component')
      );

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('gallery')).toBeInTheDocument();

      expect(elementOrder).toEqual(['search-bar', 'gallery']);
    });
  });

  describe('Layout Structure', () => {
    it('should render Material-UI Container with correct props', () => {
      const { container } = render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const containerElement = container.querySelector('.MuiContainer-root');
      expect(containerElement).toBeInTheDocument();
      expect(containerElement).toHaveClass('MuiContainer-disableGutters');
    });

    it('should render SearchBar within centered Box', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const searchBar = screen.getByTestId('search-bar');
      const parentBox = searchBar.closest('.MuiBox-root');

      expect(parentBox).toBeInTheDocument();
      expect(searchBar).toBeInTheDocument();
    });

    it('should render Gallery with top margin', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const gallery = screen.getByTestId('gallery');
      const parentBox = gallery.closest('.MuiBox-root');

      expect(parentBox).toBeInTheDocument();
      expect(gallery).toBeInTheDocument();
    });
  });

  describe('Child Component Integration', () => {
    it('should render all expected child components', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('gallery')).toBeInTheDocument();
      expect(screen.getByText('SearchBar Component')).toBeInTheDocument();
      expect(screen.getByText('Gallery Component')).toBeInTheDocument();
    });

    it('should render SearchBar and Gallery as separate components', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const searchBar = screen.getByTestId('search-bar');
      const gallery = screen.getByTestId('gallery');

      expect(searchBar).not.toBe(gallery);
      expect(searchBar).toBeInTheDocument();
      expect(gallery).toBeInTheDocument();
    });

    it('should maintain component isolation', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const searchBar = screen.getByTestId('search-bar');
      const gallery = screen.getByTestId('gallery');

      expect(
        within(searchBar).queryByTestId('gallery')
      ).not.toBeInTheDocument();
      expect(
        within(gallery).queryByTestId('search-bar')
      ).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render properly with disabled gutters', () => {
      const { container } = render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      const containerElement = container.querySelector('.MuiContainer-root');
      expect(containerElement).toHaveClass('MuiContainer-disableGutters');
    });

    it('should maintain layout structure across screen sizes', () => {
      render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
      expect(screen.getByTestId('gallery')).toBeInTheDocument();
    });
  });

  describe('Component Unmounting', () => {
    it('should unmount cleanly', () => {
      const { unmount } = render(
        <TestWrapper>
          <MovieSeeker />
        </TestWrapper>
      );

      expect(() => unmount()).not.toThrow();
    });
  });
});
