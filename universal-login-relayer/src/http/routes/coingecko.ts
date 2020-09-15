import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {CoingeckoApiInterface} from '@unilogin/commons';

const getTokensList = (coingeckoApi: CoingeckoApiInterface) =>
  async () => {
    const result = await coingeckoApi.getTokensList();
    return responseOf(result, 201);
  };

const getTokenImageUrl = (coingeckoApi: CoingeckoApiInterface) =>
  async (data: {coingeckoId: string}) => {
    const result = await coingeckoApi.getTokenImageUrl(data.coingeckoId);
    return responseOf(result, 201);
  };

const getTokenInfo = (coingeckoApi: CoingeckoApiInterface) =>
  async (data: {query: {tokens: string, currencies: string}}) => {
    const result = await coingeckoApi.getTokenInfo(data.query.tokens.split(','), data.query.currencies.split(','));
    return responseOf(result, 201);
  };

export default (coingeckoApi: CoingeckoApiInterface) => {
  const router = Router();

  router.get('/tokensList', asyncHandler(
    getTokensList(coingeckoApi),
  ));

  router.get('/tokenInfo', asyncHandler(
    sanitize({
      query: asObject({
        tokens: asString,
        currencies: asString,
      }),
    }),
    getTokenInfo(coingeckoApi),
  ));

  router.get('imageUrl/:coingeckoId', asyncHandler(
    sanitize({
      coingeckoId: asString,
    }),
    getTokenImageUrl(coingeckoApi),
  ));

  return router;
};
