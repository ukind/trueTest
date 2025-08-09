import { useState } from 'react';
import { useGetMovieDetail } from '../../../queries/searchQueries';

const usePane = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    movieId: '',
  });

  const { data: movieDetail, isLoading } = useGetMovieDetail({
    i: modalState.movieId,
    plot: 'full',
  });

  const onClickMovie = (movieId: string) => {
    setModalState((prev) => ({ ...prev, movieId, isOpen: true }));
  };

  const onClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    onClickMovie,
    onClose,
    modalState,
    movieDetail,
    isLoading,
  };
};

export default usePane;
