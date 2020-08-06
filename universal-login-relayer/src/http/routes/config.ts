import {Router, Request, Response} from 'express';
import {utils} from 'ethers';
import {PublicRelayerConfig} from '@unilogin/commons';
import asyncMiddleware from '../middlewares/async_middleware';
import {Config} from '../../config/config';

export function getPublicConfig(config: Config): PublicRelayerConfig {
  const {
    ensAddress,
    network,
    supportedTokens,
    factoryAddress,
    contractWhiteList,
    localization,
    onRampProviders,
    maxGasLimit,
    ipGeolocationApi,
    privateKey,
    ensRegistrar,
    walletContractAddress,
    fallbackHandlerAddress,
  } = config;
  return {
    ensRegistrar,
    ensAddress,
    network,
    supportedTokens,
    factoryAddress,
    fallbackHandlerAddress,
    walletContractAddress,
    contractWhiteList,
    localization,
    onRampProviders,
    maxGasLimit,
    ipGeolocationApi,
    relayerAddress: utils.computeAddress(privateKey),
  };
}

export const network = (config: PublicRelayerConfig) => (req: Request, res: Response) => {
  return res.status(200)
    .type('json')
    .send(JSON.stringify(config));
};

export default (config: PublicRelayerConfig) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
