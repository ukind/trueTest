import { Cube1, Cube2, Spinner, SpinnerContainer } from './style';

const MovieLoader = () => (
  <SpinnerContainer>
    <Spinner>
      <Cube1 />
      <Cube2 />
    </Spinner>
  </SpinnerContainer>
);

export default MovieLoader;
