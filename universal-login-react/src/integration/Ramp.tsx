import {RampInstantSDK} from '@ramp-network/ramp-instant-sdk';
import {RampConfig} from '@universal-login/commons';

type RampProps = {
  address: string;
  amount: string;
  currency: string;
  config: RampConfig;
};

export const Ramp = (props: RampProps) => {
  const {address, amount, currency, config} = props;
  const ramp = new RampInstantSDK({
    hostAppName: config.appName,
    hostLogoUrl: config.logoUrl,
    swapAmount: amount,
    swapAsset: currency,
    url: config.rampUrl,
    userAddress: address
  }).on('*', console.log);
  ramp.show();
  return null;
};
