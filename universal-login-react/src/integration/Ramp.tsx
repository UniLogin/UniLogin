import {RampInstantSDK, RampInstantEventTypes} from '@ramp-network/ramp-instant-sdk';
import {RampConfig} from '@universal-login/commons';
import {useState} from 'react';

type RampProps = {
  address: string;
  amount: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
  config: RampConfig;
};

export const Ramp = ({address, amount, currency, config, onSuccess, onCancel}: RampProps) => {
  const [purchaseCreated, setPurchaseCreated] = useState(false);

  function onClose() {
    if (purchaseCreated) {
      onSuccess();
    } else {
      onCancel();
    }
  }

  const ramp = new RampInstantSDK({
    hostAppName: config.appName,
    hostLogoUrl: config.logoUrl,
    swapAmount: amount,
    swapAsset: currency,
    url: config.rampUrl,
    userAddress: address,
  }).on(RampInstantEventTypes.PURCHASE_CREATED, () => setPurchaseCreated(true))
    .on(RampInstantEventTypes.WIDGET_CLOSE, onClose)
    .on('*', console.log);
  ramp.domNodes.overlay.style.zIndex = '99999';
  ramp.show();
  return null;
};
