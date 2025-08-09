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
    <Modal open={isOpen} onClose={onClose}>
      <Container onKeyDown={onClose} onClick={onClose}>
        <Wrapper>
          {isLoading ? (
            <>
              <ImageContainer>
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
    </Modal>
  );
};

export default Pane;
