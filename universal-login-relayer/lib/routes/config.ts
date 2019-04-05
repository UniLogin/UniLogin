import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {ChainSpecConfig} from '../config/relayer';



export const network = (config : ChainSpecConfig) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : ChainSpecConfig) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
