import { styled } from '@mui/material';

export const MoviesContainer = styled('div')`
  position: relative;
  display: block;
`;

export const MoviesWrapper = styled('div')`
  position: relative;
  display: block;
`;

export const MoviesList = styled('ul')`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: unset;
`;

export const MoviesItem = styled('li')`
  position: relative;
  display: block;
`;

export const MoviesItemButton = styled('button')`
  border-radius: 0.5rem 0 0 0.5rem;
  border: 3px solid #ff6735;
  text-align: center;
  background: none;
  padding: 0;
  cursor: pointer;
  width: 294px;
  transition: all 0.3s ease-in;
  &:hover {
    cursor: pointer;
    width: 310px;
    transition: all 0.3s ease-in;
    overflow: hidden;

    & > img {
      filter: saturate(2);
      transition: all 0.3s ease-in;
    }
  }
  &:not(:hover) {
    transition: all 0.3s ease-in;
    & > img {
      filter: saturate(1);
      transition: all 0.3s ease-in;
    }
  }

  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MoviesItemImage = styled('img')`
  width: 100%;
  height: 450px;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease-in;
`;

export const MoviesItemHeader = styled('div')`
  position: relative;
  display: block;
  background-color: rgba(1, 1, 1, 0.5);
  color: white;
  width: 100%;
`;

export const MoviesItemTitle = styled('h5')`
  font-family: 'Inconsolata', sans-serif;
  font-weight: bold;
  font-size: 1.125rem;
  margin-top: 0.5rem;
`;

export const MoviesItemYear = styled('p')`
  font-family: 'Inconsolata', sans-serif;
  font-weight: normal;
`;
