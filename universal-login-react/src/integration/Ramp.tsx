import {RampInstantSDK} from '@ramp-network/ramp-instant-sdk';
import {RampConfig} from '@universal-login/commons';

type RampProps = {
  address: string;
  amount: string;
  currency: string;
  onClose: () => void;
  config: RampConfig;
};

export const Ramp = (props: RampProps) => {
  enum WidgetEventTypes {
    WIDGET_CLOSE = 'WIDGET_CLOSE',
    WIDGET_CONFIG_DONE = 'WIDGET_CONFIG_DONE'
  }
  const {address, amount, currency, config, onClose} = props;
  const ramp = new RampInstantSDK({
    hostAppName: config.appName,
    hostLogoUrl: config.logoUrl,
    swapAmount: amount,
    swapAsset: currency,
    url: config.rampUrl,
    userAddress: address
  }).on(WidgetEventTypes.WIDGET_CLOSE, onClose)
  .on('*', console.log);
  ramp.show();
  return null;
};
