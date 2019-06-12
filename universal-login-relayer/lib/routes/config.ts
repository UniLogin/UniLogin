import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {Config} from '../config/relayer';

export type ConfigApi = Pick<Config, 'chainSpec' | 'supportedTokens' | 'factoryAddress'>;

export const network = (config : ConfigApi) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : ConfigApi) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
