import {WyreConfig} from '@unilogin/commons';

interface WyreProps {
  address: string;
  currency: string;
  config: WyreConfig;
}

export const Wyre = ({address, currency, config}: WyreProps) => {
  const currentLocation = window.location.href;
  const url = getWyreUrl(address, currency, currentLocation, config);
  window.location.href = url;
  return null;
};

export const getWyreUrl = (address: string, currency: string, redirectUrl: string, config: WyreConfig) =>
  `${config.wyreUrl}` +
  `?destCurrency=${currency}` +
  `&dest=${address}` +
  `&paymentMethod=${config.paymentMethod}` +
  `&redirectUrl=${redirectUrl}`;
