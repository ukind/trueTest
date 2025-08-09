import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useFindSuggestion } from '../../../queries/searchQueries';
import type { Search } from '../../../services/Search/types';
import type { searchSchemaType } from './schema';
import searchSchema from './schema';
import type { SuggestionState } from './types';

const useSearchBar = () => {
  const [_, setSearchParams] = useSearchParams();

  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    suggestions: [],
  });

  const { control, formState, handleSubmit } = useForm<searchSchemaType>({
    defaultValues: {
      searchTitle: '',
      selectedTitle: '',
      type: 'movie',
    },
    resolver: zodResolver(searchSchema),
    mode: 'onChange',
  });

  const [searchTitle, type] = useWatch({
    control: control,
    name: ['searchTitle', 'type'],
  });

  const { data } = useFindSuggestion({
    page: 1,
    s: searchTitle.trim(),
    type,
  });

  const addParamsToUrl = (selectedTitle?: string) => {
    setSearchParams({ q: selectedTitle ?? '' });
  };

  const onSelectDropdown = (
    value: string | Search.getMovies.SearchEntity | null
  ) => {
    const title = typeof value === 'string' ? value : value?.Title;

    addParamsToUrl(title);
  };

  const onSearch = (value: string) => {
    addParamsToUrl(value);
  };

  useEffect(() => {
    if (data?.Search?.length) {
      setSuggestionState({
        suggestions: data?.Search,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!searchTitle) {
      setSuggestionState({ suggestions: [] });
    }
  }, [searchTitle]);

  const { suggestions } = suggestionState;

  return {
    control,
    formState,
    suggestions,
    onSelectDropdown,
    onSearch,
    searchTitle,
    handleSubmit,
  };
};

export default useSearchBar;
