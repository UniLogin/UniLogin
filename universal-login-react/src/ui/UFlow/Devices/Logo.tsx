import React from 'react';

interface LogoProps {
  logo: string;
  applicationName: string;
}

export const Logo = ({logo, applicationName}: LogoProps) => {
  const src = logo === 'none'
    ? 'https://universalloginsdk.readthedocs.io/en/latest/_images/logo.png'
    : logo;
  return (
    <img
      src={src}
      alt={applicationName}
      className={`connected-devices-img ${logo === 'none' ? 'default' : ''}`}
    />
  );
};
