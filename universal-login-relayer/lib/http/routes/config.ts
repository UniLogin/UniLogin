import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {Config} from '../../config/relayer';
import {PublicRelayerConfig} from '@universal-login/commons';

export function getPublicConfig(config: Config): PublicRelayerConfig {
  const {chainSpec, supportedTokens, factoryAddress, contractWhiteList, localization, onRampProviders} = config;
  return {
    chainSpec,
    supportedTokens,
    factoryAddress,
    contractWhiteList,
    localization,
    onRampProviders
  };
}

export const network = (config: PublicRelayerConfig) => async (req: Request, res: Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config: PublicRelayerConfig) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
