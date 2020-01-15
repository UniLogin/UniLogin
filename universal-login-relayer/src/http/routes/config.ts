import {Router, Request, Response} from 'express';
import {utils} from 'ethers';
import {PublicRelayerConfig} from '@universal-login/commons';
import asyncMiddleware from '../middlewares/async_middleware';
import {Config} from '../../config/relayer';

export function getPublicConfig(config: Config): PublicRelayerConfig {
  const {chainSpec, supportedTokens, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi, privateKey, ensRegistrar, walletContractAddress} = config;
  return {
    ensRegistrar,
    chainSpec,
    supportedTokens,
    factoryAddress,
    walletContractAddress,
    contractWhiteList,
    localization,
    onRampProviders,
    maxGasLimit,
    ipGeolocationApi,
    relayerAddress: utils.computeAddress(privateKey),
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
