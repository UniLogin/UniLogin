import React from 'react';
import {DeviceType} from '@unilogin/commons';
import LaptopImg from '../../assets/icons/laptop.svg';
import PhoneImg from '../../assets/icons/phone.svg';
import TabletImg from '../../assets/icons/tablet.svg';
import BrowserImg from '../../assets/icons/browser.svg';
import LaptopImgBlack from '../../assets/jarvis/laptop.svg';
import PhoneImgBlack from '../../assets/jarvis/phone.svg';
import TabletImgBlack from '../../assets/jarvis/tablet.svg';
import BrowserImgBlack from '../../assets/jarvis/browser.svg';
import {useThemeName} from '../../utils/classFor';

interface LogoProps {
  logo: string;
  applicationName: string;
  deviceType: DeviceType;
}

const deviceTypesBlack: Record<DeviceType, string> = {
  laptop: LaptopImgBlack,
  phone: PhoneImgBlack,
  tablet: TabletImgBlack,
  unknown: BrowserImgBlack,
};

const deviceTypesWhite: Record<DeviceType, string> = {
  laptop: LaptopImg,
  phone: PhoneImg,
  tablet: TabletImg,
  unknown: BrowserImg,
};

const getDeviceTypeImg = (deviceType: DeviceType, color: string) => {
  switch (color) {
    case 'black': return deviceTypesBlack[deviceType];
    default: return deviceTypesWhite[deviceType];
  }
};

export const Logo = ({logo, applicationName, deviceType}: LogoProps) => {
  const color = useThemeName() === 'default' ? 'white' : 'black';
  return (
    <div className={'connected-devices-img-wrapper'}>
      <img
        src={getDeviceTypeImg(deviceType, color)}
        alt={applicationName}
        className={`connected-devices-img ${logo === 'none' ? 'default' : ''}`}
      />
    </div>
  );
};
