import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

declare interface Config {
  port: number;
  jsonRpcUrl: string;
  privateKey: string;
  walletMasterAddress: string;
  tokenContractAddress: string;
  chainSpec: {
    ensAddress: string;
    chainId: number;
  };
  ensRegistrars: string[];
}

export const network = (config : Config) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : Config) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
