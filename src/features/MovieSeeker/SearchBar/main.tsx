import {
  Autocomplete,
  Box,
  FormControl,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Search } from '../../../services/Search/types';
import useSearchBar from './useSearchBar';

const SearchBar = () => {
  const { suggestions, control, onSelectDropdown } = useSearchBar();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  let width = '580px';
  if (isSmallScreen) width = '100%';

  return (
    <Box>
      <Controller
        name="searchTitle"
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <FormControl sx={{ width: width }}>
              <Autocomplete
                options={suggestions || []}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.Title
                }
                popupIcon={null}
                freeSolo
                onChange={(_, newValue) => {
                  const val = newValue as Search.getMovies.SearchEntity;
                  onSelectDropdown(val?.Title);
                }}
                slotProps={{
                  listbox: {
                    sx: {
                      maxHeight: 200,
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: '3px',
                      },
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#888 transparent',
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onChange}
                    value={value}
                    placeholder="Search for a movies..."
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: 'unset',
                      },
                      '&& .MuiOutlinedInput-root': {
                        padding: 0,
                      },

                      '&& .MuiAutocomplete-input': {
                        paddingLeft: '18px',
                      },
                      input: {
                        backgroundColor: '#000',
                        color: '#adadad',
                        borderRadius: '3px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiOutlinedInput-input': {
                        transition: 'box-shadow 0.3s',
                      },

                      '& .MuiOutlinedInput-input:focus': {
                        boxShadow:
                          'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 20px 2px rgba(102, 175, 233, 0.6)',
                        outline: 'none',
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          );
        }}
      />
    </Box>
  );
};

export default SearchBar;
