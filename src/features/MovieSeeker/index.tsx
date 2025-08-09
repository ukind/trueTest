import { Box, Container } from '@mui/material';
import Gallery from './Gallery';
import SearchBar from './SearchBar';
import { Header, Logo } from './style';

const MovieSeeker = () => {
  return (
    <Container maxWidth={false} disableGutters>
      <Header></Header>
      <Logo></Logo>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SearchBar></SearchBar>
      </Box>
      <Box
        sx={{
          marginTop: '4rem',
        }}
      >
        <Gallery></Gallery>
      </Box>
    </Container>
  );
};

export default MovieSeeker;
