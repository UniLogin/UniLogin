import React from 'react';
import {UNIVERSAL_LOGIN_LOGO_URL as DEFAULT_LOGO} from '@universal-login/commons';

interface LogoProps {
  logo: string;
  applicationName: string;
}

export const Logo = ({logo, applicationName}: LogoProps) => {
  const src = logo === 'none' ? DEFAULT_LOGO : logo;
  return (
    <img
      src={src}
      alt={applicationName}
      className={`connected-devices-img ${logo === 'none' ? 'default' : ''}`}
    />
  );
};
