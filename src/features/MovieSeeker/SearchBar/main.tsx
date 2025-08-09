import {
  Autocomplete,
  Box,
  FormControl,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { listboxStyles, searchBarStyles, textFieldStyles } from './style';
import useSearchBar from './useSearchBar';

const SearchBar = () => {
  const {
    suggestions,
    control,
    onSelectDropdown,
    formState,
    onSearch,
    handleSubmit,
  } = useSearchBar();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={searchBarStyles}>
      <Controller
        name="selectedTitle"
        control={control}
        render={({ field }) => {
          return (
            <form
              onSubmit={handleSubmit(({ searchTitle }) => {
                onSearch(searchTitle);
              })}
            >
              <FormControl sx={{ width: '100%' }}>
                <Autocomplete
                  options={suggestions || []}
                  getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.Title
                  }
                  value={field.value}
                  popupIcon={null}
                  freeSolo
                  onChange={(_, value) => {
                    onSelectDropdown(value);
                  }}
                  slotProps={{
                    listbox: {
                      sx: listboxStyles,
                    },
                  }}
                  renderInput={(params) => (
                    <Controller
                      name="searchTitle"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <TextField
                            {...params}
                            onChange={onChange}
                            value={value}
                            placeholder={
                              isSmallScreen
                                ? 'Search movies...'
                                : 'Search for a movie...'
                            }
                            error={!!formState.errors.searchTitle}
                            helperText={
                              formState.errors.searchTitle?.message || ' '
                            }
                            sx={textFieldStyles}
                          />
                        );
                      }}
                    ></Controller>
                  )}
                />
              </FormControl>
            </form>
          );
        }}
      />
    </Box>
  );
};

export default SearchBar;
