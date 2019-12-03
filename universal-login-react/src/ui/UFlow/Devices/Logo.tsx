import React from 'react';
import {UNIVERSAL_LOGIN_LOGO_URL as DEFAULT_LOGO} from '@universal-login/commons';

interface LogoProps {
  logo: string;
  applicationName: string;
  deviceType: string;
}

export const Logo = ({logo, applicationName, deviceType}: LogoProps) => {
  const src = isLogoEmpty(logo) ? DEFAULT_LOGO : logo;
  return (
    <div className={`connected-devices-img-wrapper ${deviceType !== 'unknown' ? deviceType : 'default'}`}>
      <img
        src={src}
        alt={applicationName}
        className={`connected-devices-img ${logo === 'none' ? 'default' : ''}`}
      />
    </div>
  );
};

const isLogoEmpty = (logo: string) => logo === 'none' || logo === '';
