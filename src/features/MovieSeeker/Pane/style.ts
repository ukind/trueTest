import { styled } from '@mui/material';

export const Container = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Wrapper = styled('div')`
  display: grid;
  background-color: #333533;
  grid-template-columns: auto 600px;
  border: 2px solid #dc2626;
  border-radius: 1.5rem;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    overflow: auto;
  }
`;

export const ImageContainer = styled('div')`
  position: relative;
`;

export const Image = styled('img')`
  border-bottom-left-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  display: block;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  display: block;

  @media (max-width: 768px) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    width: 100%;
  }
`;

export const Info = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  color: white;
  font-family: Inter, sans-serif;
`;

export const Title = styled('h5')`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
`;

export const Genre = styled('h5')`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
`;

export const Meta = styled('h5')`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.5;
`;

export const Plot = styled('p')`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
`;

export const Label = styled('span')`
  color: #dc2626;
  font-weight: 700;
  margin-right: 1rem;
`;
