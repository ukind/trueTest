import type { ComponentProps } from 'react';
import { Cube1, Cube2, Spinner, SpinnerContainer } from './style';

const MovieLoader = (props: ComponentProps<typeof SpinnerContainer>) => (
  <SpinnerContainer {...props}>
    <Spinner>
      <Cube1 />
      <Cube2 />
    </Spinner>
  </SpinnerContainer>
);

export default MovieLoader;
