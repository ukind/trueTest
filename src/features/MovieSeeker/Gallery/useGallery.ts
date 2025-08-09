import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetMovieList } from '../../../queries/searchQueries';
import type { Search } from '../../../services/Search/types';
import { debounce } from '../../../utils/debounce';

const useGallery = ({
  onClickMovie,
}: {
  onClickMovie: (movieId: string) => void;
}) => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [movieList, setMovieList] = useState<Search.getMovies.SearchEntity[]>(
    []
  );

  const urlQuery = searchParams.get('q') || '';

  const moviesContainer = useRef<HTMLDivElement>(null);

  const isAtBottom = (el: HTMLDivElement | null) => {
    const scrollbarPosition = el?.getBoundingClientRect().bottom || 0;

    const windowHigh = window.innerHeight;
    return scrollbarPosition - 10 <= windowHigh;
  };

  const onScrollHandler = () => {
    const movieGallery = moviesContainer.current;

    if (isAtBottom(movieGallery)) {
      setCurrentPage((prevState) => prevState + 1);
    }
  };

  const { data: { Search } = {}, isLoading } = useGetMovieList({
    page: currentPage,
    s: urlQuery,
    type: 'movie',
  });

  const onClickItem = (movieId: string) => {
    onClickMovie(movieId);
  };

  useEffect(() => {
    const debouncedScroll = debounce(onScrollHandler, 500);
    window.addEventListener('scroll', debouncedScroll);

    return function cleanup() {
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, []);

  useEffect(() => {
    setMovieList([]);
    setCurrentPage(1);
  }, [urlQuery]);

  useEffect(() => {
    if (Search) {
      setMovieList((prevState) => [...prevState, ...Search]);
    }
  }, [Search]);

  return {
    movieList,
    isLoading,
    moviesContainer,
    onClickItem,
  };
};

export default useGallery;
