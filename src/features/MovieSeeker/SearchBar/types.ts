import type { Search } from '../../../services/Search/types';

export interface SuggestionState {
  suggestions: Search.getMovies.SearchEntity[];
}
