import { Box, Container } from '@mui/material';
import backgroundImage from '../../assets/images/body-bg.jpg';
import Logo from '../../assets/images/main-logo.png';
import SearchBar from './SearchBar';

const MovieSeeker = () => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: 'relative',
        display: 'block',
        background: `url(${backgroundImage}) repeat 0 0`,
        height: '100%',
      }}
    >
      <Box
        sx={{
          background: '#000',
          position: 'relative',
          height: '20px',
          borderBottom: '2px solid rgba(197, 60, 10, 1)',
          boxShadow:
            'inset 0 1px 1px rgba(0, 0, 0, .075), 0 7px 20px rgb(231 102 233 / 38%)',
        }}
      ></Box>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          backgroundImage: `url(${Logo})`,
          justifyContent: 'center',
          height: '300px',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <SearchBar></SearchBar>
      </Box>
      <Box>Gallery</Box>
    </Container>
  );
};

export default MovieSeeker;
