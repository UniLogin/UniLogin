import SafelloLogoWhite from './../../assets/topUp/safello-white.png';
import SafelloLogo from './../../assets/logos/safello@2x.png';
import RampLogoWhite from './../../assets/topUp/ramp-white.png';
import RampLogo from './../../assets/logos/ramp.png';
import WyreLogoWhite from './../../assets/topUp/wyre-white.svg';
import WyreLogo from './../../assets/logos/wyre@2x.png';

export type OnRampProviderName = 'ramp' | 'safello' | 'wyre';

const logosBlack: Record<OnRampProviderName, string> = {
  ramp: RampLogo,
  safello: SafelloLogo,
  wyre: WyreLogo,
};

const logosWhite: Record<OnRampProviderName, string> = {
  ramp: RampLogoWhite,
  safello: SafelloLogoWhite,
  wyre: WyreLogoWhite,
};

export const getOnRampProviderLogo = (providerName: OnRampProviderName, color?: string) => {
  switch (color) {
    case 'white': return logosWhite[providerName];
    default: return logosBlack[providerName];
  }
};
