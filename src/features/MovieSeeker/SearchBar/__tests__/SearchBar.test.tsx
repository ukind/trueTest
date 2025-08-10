import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SearchBar from '../main';

// Create mock functions
const mockUseFindSuggestion = vi.fn();
const mockSetSearchParams = vi.fn();

// Mock the search queries module
vi.mock('../../../queries/searchQueries', () => ({
  useFindSuggestion: mockUseFindSuggestion,
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
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
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('SearchBar Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFindSuggestion.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial Render', () => {
    it('should render search input with correct placeholder', () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search for a movie/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should render with responsive placeholder on small screens', () => {
      // Mock useMediaQuery for small screen
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query.includes('(max-width:'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should be accessible with proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('User Typing Interactions', () => {
    it('should allow user to type in search input', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');

      await user.type(searchInput, 'Inception');

      await waitFor(() => {
        expect(searchInput).toHaveValue('Inception');
      });
    });

    it('should clear input when user clears the field', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');

      await user.type(searchInput, 'Inception');
      await user.clear(searchInput);

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });
  });

  describe('Form Submission', () => {
    it('should handle form submission with valid data', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'Inception');

      // Find and submit the form
      const form = searchInput.closest('form');
      expect(form).toBeInTheDocument();

      if (form) {
        await user.type(searchInput, '{enter}');

        await waitFor(() => {
          expect(mockSetSearchParams).toHaveBeenCalledWith({ q: 'Inception' });
        });
      }
    });

    it('should handle Enter key submission', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'Inception{enter}');

      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for invalid characters', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'Movie@Title!');

      // Trigger validation by attempting to submit
      await user.type(searchInput, '{enter}');

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /movie titles can only contain letters, numbers and spaces/i
        );
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should show validation error for overly long input', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      const longTitle = 'a'.repeat(101);

      await user.type(searchInput, longTitle);
      await user.type(searchInput, '{enter}');

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /movie title should be under 100 characters/i
        );
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it('should clear validation errors when input becomes valid', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');

      // First enter invalid input
      await user.type(searchInput, 'Movie@Title!');
      await user.type(searchInput, '{enter}');

      await waitFor(() => {
        expect(
          screen.getByText(
            /movie titles can only contain letters, numbers and spaces/i
          )
        ).toBeInTheDocument();
      });

      // Clear and enter valid input
      await user.clear(searchInput);
      await user.type(searchInput, 'Inception');

      await waitFor(() => {
        expect(
          screen.queryByText(
            /movie titles can only contain letters, numbers and spaces/i
          )
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation', async () => {
      const mockSuggestions = [
        {
          Title: 'Inception',
          Year: '2010',
          imdbID: 'tt1375666',
          Type: 'movie',
          Poster: 'test-poster.jpg',
        },
        {
          Title: 'Inception: The Cobol Job',
          Year: '2010',
          imdbID: 'tt5295990',
          Type: 'movie',
          Poster: 'test-poster2.jpg',
        },
      ];

      mockUseFindSuggestion.mockReturnValue({
        data: { Search: mockSuggestions },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'Inception');

      // Test arrow key navigation
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
      await user.keyboard('{Escape}');

      expect(searchInput).toHaveFocus();
    });

    it('should be focusable and have proper tab order', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');

      await user.tab();
      expect(searchInput).toHaveFocus();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toHaveAttribute('aria-expanded');
      expect(searchInput).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('should announce validation errors to screen readers', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      await user.type(searchInput, 'Movie@Title!');
      await user.type(searchInput, '{enter}');

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /movie titles can only contain letters, numbers and spaces/i
        );
        expect(errorMessage).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should support screen reader navigation', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();

      // Verify the input is properly labeled for screen readers
      expect(searchInput).toHaveAttribute('placeholder');
    });
  });

  describe('Loading and Error States', () => {
    it('should handle loading state', async () => {
      mockUseFindSuggestion.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).not.toBeDisabled();
    });

    it('should handle error state gracefully', async () => {
      mockUseFindSuggestion.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('API Error'),
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmounting cleanly', () => {
      const { unmount } = render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid typing without breaking', async () => {
      render(
        <TestWrapper>
          <SearchBar />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('combobox');

      // Simulate rapid typing
      await user.type(searchInput, 'abcdefghijklmnopqrstuvwxyz');

      await waitFor(() => {
        expect(searchInput).toHaveValue('abcdefghijklmnopqrstuvwxyz');
      });
    });
  });
});
