import { Modal, Skeleton } from '@mui/material';
import type { Search } from '../../../services/Search/types';
import {
  Container,
  Genre,
  Image,
  ImageContainer,
  Info,
  Label,
  Meta,
  Plot,
  Title,
  Wrapper,
} from './style';

const Pane = ({
  isOpen,
  onClose,
  movieDetail,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  movieDetail?: Search.getMovieDetail.Response;
  isLoading: boolean;
}) => {
  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onKeyDown={onClose}
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === 'backdropClick') {
          onClose();
        }
      }}
      data-testid="pane-open"
    >
      <div
        className="container"
        style={{
          position: 'relative',
          display: 'flex',
        }}
      >
        <Container data-testid="movie-detail">
          <Wrapper>
            {isLoading ? (
              <>
                <ImageContainer data-testid="pane-loading">
                  <Skeleton
                    variant="rectangular"
                    width={400}
                    height={450}
                    animation="wave"
                  />
                </ImageContainer>
                <Info>
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={24}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={24}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={80}
                    animation="wave"
                  />
                </Info>
              </>
            ) : (
              <>
                <ImageContainer>
                  <Image
                    src={movieDetail?.Poster}
                    alt={movieDetail?.Title || 'Movie poster'}
                    srcSet=""
                  />
                </ImageContainer>
                <Info>
                  <Title>
                    <Label>Title:</Label>
                    {movieDetail?.Title}
                  </Title>
                  <Genre>
                    <Label>Genre:</Label>
                    {movieDetail?.Genre}
                  </Genre>
                  <Meta>
                    <Label>Score:</Label>
                    {movieDetail?.Metascore}
                  </Meta>
                  <Plot>{movieDetail?.Plot}</Plot>
                </Info>
              </>
            )}
          </Wrapper>
        </Container>
      </div>
    </Modal>
  );
};

export default Pane;
