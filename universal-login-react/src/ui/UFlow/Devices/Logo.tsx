import React from 'react';

interface LogoProps {
  logo: string;
  applicationName: string;
}

export const Logo = ({logo, applicationName}: LogoProps) => {
  const alt = logo === 'none' ? logo : applicationName;
  return <img src={logo} alt={alt} className="connected-devices-img" />;
};
