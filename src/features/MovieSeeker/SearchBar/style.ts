export const textFieldStyles = {
  '& .MuiInputBase-root': {
    padding: {
      xs: '8px 12px',
      sm: 'unset',
    },
    borderRadius: '3px',
    transition: 'all 0.3s ease',
  },
  '&& .MuiOutlinedInput-root': {
    padding: {
      xs: 0,
      sm: 'unset',
    },
  },
  '&& .MuiAutocomplete-input': {
    paddingLeft: {
      xs: '12px',
      sm: '18px',
    },
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
      md: '1.125rem',
    },
  },
  input: {
    backgroundColor: '#000',
    color: '#adadad',
    borderRadius: '3px',
    height: {
      xs: '44px',
      sm: '56px',
    },
    '&::placeholder': {
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
      },
      color: '#666',
      opacity: 0.7,
    },
    '&:focus': {
      color: '#fff',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #333',
    transition: 'all 0.3s ease',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid #007bff',
    boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
  },
  '& .MuiOutlinedInput-input': {
    transition: 'box-shadow 0.3s',
    padding: {
      xs: '8px 12px',
      sm: 'unset',
    },
  },
  '& .MuiOutlinedInput-input:focus': {
    boxShadow:
      'inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 20px 2px rgba(102, 175, 233, 0.6)',
    outline: 'none',
  },

  '&.Mui-error': {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ff4757',
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: '#ff3742',
      },
    },
    '& .MuiOutlinedInput-input': {
      '&:focus': {
        boxShadow:
          'inset 0 1px 1px rgba(255, 71, 87, 0.075), 0 0 0 2px rgba(255, 71, 87, 0.25)',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ff4757',
      boxShadow: '0 0 0 2px rgba(255, 71, 87, 0.1)',
    },
  },

  '& .MuiFormHelperText-root': {
    fontSize: {
      xs: '0.75rem',
      sm: '0.8125rem',
    },
    marginTop: '4px',
    fontWeight: 400,
    lineHeight: '1.4',
    '&.Mui-error': {
      color: '#ff4757',
      fontSize: {
        xs: '0.75rem',
        sm: '0.8125rem',
      },
      fontWeight: 500,
    },
  },
};

export const listboxStyles = {
  maxHeight: {
    xs: '180px',
    sm: '200px',
    md: '220px',
  },
  '&::-webkit-scrollbar': {
    width: {
      xs: '4px',
      sm: '6px',
    },
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',
    borderRadius: {
      xs: '2px',
      sm: '3px',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#888 transparent',
};

export const searchBarStyles = {
  width: {
    xs: '90%',
    sm: '90%',
    md: '580px',
    lg: '680px',
    xl: '780px',
  },
  maxWidth: {
    xs: '100%',
    sm: '100%',
    md: '700px',
    lg: '800px',
    xl: '900px',
  },
};
