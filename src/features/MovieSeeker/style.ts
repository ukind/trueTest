import { Box, styled } from '@mui/material';

import LogoIcon from '../../assets/images/main-logo.png';

export const Header = styled(Box)`
  background: #000;
  position: relative;
  height: 20px;
  border-bottom: 2px solid rgba(27, 19, 17, 1);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 7px 20px rgb(231 102 233 / 38%);
`;

export const Logo = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  height: 300px;
  background-image: url(${LogoIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
