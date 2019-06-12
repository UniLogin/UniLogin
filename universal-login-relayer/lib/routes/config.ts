import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {Config} from '../config/relayer';

export type PublicConfig = Pick<Config, 'chainSpec' | 'supportedTokens' | 'factoryAddress'>;

export const network = (config : PublicConfig) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : PublicConfig) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
