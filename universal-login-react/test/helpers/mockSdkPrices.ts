import UniLoginSdk from '@unilogin/sdk';

export const mockSdkPrices = (sdk: UniLoginSdk) => {
  sdk.priceObserver.getCurrentPrices = () => {
    return Promise.resolve({ETH: {USD: 100, DAI: 99, SAI: 99, ETH: 1}});
  };
  return sdk.priceObserver.getCurrentPrices;
};
