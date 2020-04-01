import {RampInstantSDK, RampInstantEventTypes} from '@ramp-network/ramp-instant-sdk';
import {RampConfig} from '@unilogin/commons';
import {useEffect, useState} from 'react';
import {useMutableCallback} from 'react-use-mutable';

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

  const onClose = useMutableCallback(purchaseCreated ? onSuccess : onCancel);

  useEffect(() => {
    const ramp = new RampInstantSDK({
      hostAppName: config.appName,
      hostLogoUrl: config.logoUrl,
      swapAmount: amount,
      swapAsset: currency,
      url: config.rampUrl,
      userAddress: address,
      variant: 'auto',
      hostApiKey: config.rampApiKey,
    }).on(RampInstantEventTypes.PURCHASE_CREATED, () => setPurchaseCreated(true))
      .on(RampInstantEventTypes.WIDGET_CLOSE, onClose);
    ramp.domNodes.overlay.style.zIndex = '99999';
    ramp.show();
  }, []);

  return null;
};
