import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useFindSuggestion } from '../../../queries/searchQueries';
import type { searchSchemaType } from './schema';
import searchSchema from './schema';
import type { SuggestionState } from './types';

const useSearchBar = () => {
  const [suggestionState, setSuggestionState] = useState<SuggestionState>({
    suggestions: [],
    isSuggestionOpen: false,
  });

  const { control, setValue, getFieldState } = useForm<searchSchemaType>({
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
    s: searchTitle,
    type,
  });

  const onSelectDropdown = (value?: string) => {
    setSuggestionState((prev) => ({ ...prev, isSuggestionOpen: false }));
    setValue('selectedTitle', value);
  };

  useEffect(() => {
    if (data?.Search?.length) {
      setSuggestionState({
        suggestions: data?.Search,
        isSuggestionOpen: true,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!searchTitle) {
      setSuggestionState({ suggestions: [], isSuggestionOpen: false });
    }
  }, [searchTitle]);

  return {
    control,
    suggestions: suggestionState.suggestions,
    onSelectDropdown,
    isSuggestionOpen: suggestionState.isSuggestionOpen,
    searchTitle,
  };
};

export default useSearchBar;
