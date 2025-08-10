import MovieLoader from '../../../components/MovieLoader';
import {
  MoviesContainer,
  MoviesItem,
  MoviesItemButton,
  MoviesItemHeader,
  MoviesItemImage,
  MoviesItemTitle,
  MoviesItemYear,
  MoviesList,
  MoviesWrapper,
} from './stye';

import LogoPlaceholder from '../../../assets/images/placeholder.png';
import Pane from '../Pane';
import usePane from '../Pane/usePane';
import useGallery from './useGallery';

const Gallery = () => {
  const {
    onClickMovie,
    onClose,
    modalState,
    isLoading: movieDetailIsLoading,
    movieDetail,
  } = usePane();

  const { isLoading, movieList, moviesContainer, onClickItem } = useGallery({
    onClickMovie,
  });

  const { isOpen } = modalState;

  return (
    <div data-testid="pane">
      <Pane
        isLoading={movieDetailIsLoading}
        isOpen={isOpen}
        onClose={onClose}
        movieDetail={movieDetail}
      ></Pane>
      {isLoading && <MovieLoader data-testid="movie-loader"></MovieLoader>}
      <MoviesContainer ref={moviesContainer}>
        <MoviesWrapper>
          <MoviesList>
            {movieList?.map((el, idx) => (
              <MoviesItem key={`${el.imdbID}-${idx}`}>
                <MoviesItemButton
                  type="button"
                  onClick={() => {
                    onClickItem(el.imdbID);
                  }}
                >
                  <MoviesItemImage
                    src={el.Poster}
                    alt={el.Title}
                    loading="lazy"
                    width="294"
                    height="200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = LogoPlaceholder;
                    }}
                  />
                  <MoviesItemHeader>
                    <MoviesItemTitle>{el.Title}</MoviesItemTitle>
                    <MoviesItemYear>{el.Year}</MoviesItemYear>
                  </MoviesItemHeader>
                </MoviesItemButton>
              </MoviesItem>
            ))}
          </MoviesList>
        </MoviesWrapper>
      </MoviesContainer>
    </div>
  );
};

export default Gallery;
