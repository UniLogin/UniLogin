import SafelloLogoWhite from './../../assets/topUp/safello-white.png';
import SafelloLogo from './../../assets/logos/safello@2x.png';
import RampLogoWhite from './../../assets/topUp/ramp-white.png';
import RampLogo from './../../assets/logos/ramp.png';
import WyreLogoWhite from './../../assets/topUp/wyre-white.svg';
import WyreLogo from './../../assets/logos/wyre@2x.png';
import {TopUpProvider} from '../../../core/models/TopUpProvider';

const logosBlack: Record<TopUpProvider, string> = {
  RAMP: RampLogo,
  SAFELLO: SafelloLogo,
  WYRE: WyreLogo,
};

const logosWhite: Record<TopUpProvider, string> = {
  RAMP: RampLogoWhite,
  SAFELLO: SafelloLogoWhite,
  WYRE: WyreLogoWhite,
};

export const getOnRampProviderLogo = (providerName: TopUpProvider, color?: string) => {
  switch (color) {
    case 'white': return logosWhite[providerName];
    default: return logosBlack[providerName];
  }
};
