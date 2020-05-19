import {TokenPricesService, ETHER_NATIVE_TOKEN, TEST_TOKEN_PRICE_IN_ETH} from '../../../src';

export const getTokenPricesServiceMock = () => {
  const tokenPricesService = new TokenPricesService();
  tokenPricesService.getTokenPriceInEth = (tokenDetails: any) => Promise.resolve(tokenDetails?.address === ETHER_NATIVE_TOKEN.address ? 1 : TEST_TOKEN_PRICE_IN_ETH);
  return tokenPricesService;
};
