import React from 'react';

interface LogoProps {
  logo: string;
  applicationName: string;
}

const DEFAULT_LOGO = 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png';

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
