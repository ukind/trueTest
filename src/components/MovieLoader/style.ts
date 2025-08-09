import { keyframes, styled } from '@mui/material';

export const SpinnerContainer = styled('div')`
  width: 100%;
  height: 100%;
  background-color: rgba(1, 1, 1, 0.5);
  position: fixed;
  top: 0;
  display: flex;
  align-items: center;
  z-index: 4;
`;

export const spin = keyframes`
  25% {
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  }
  50% {
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  }
  50.1% {
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  }
  75% {
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg)
      scale(0.5);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
`;

export const Spinner = styled('div')`
  margin: 0 auto;
  width: 200px;
  height: 200px;
  position: relative;
`;

export const Cube1 = styled('div')`
  background-color: #ee490e;
  width: 45px;
  height: 45px;
  position: absolute;
  top: 50px;
  left: 50px;

  animation: ${spin} 1.8s infinite ease-in-out;
`;

export const Cube2 = styled(Cube1)`
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
`;
