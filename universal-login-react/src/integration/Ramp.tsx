import {RampInstantSDK} from '@ramp-network/ramp-instant-sdk';

type RampProps = {
  address: string;
  amount: string;
}

export const Ramp = (props: RampProps) => {
  const {address, amount} = props;
  const ramp = new RampInstantSDK({
    hostAppName: "Universal Login",
    hostLogoUrl:
      "https://cdn-images-1.medium.com/max/2600/1*nqtMwugX7TtpcS-5c3lRjw.png",
    swapAmount: amount,
    swapAsset: 'ETH',
    url: 'https://ri-widget-staging-ropsten.firebaseapp.com/',
    userAddress: address
  }).on('*', console.log);
  ramp.show();
  return null;
}