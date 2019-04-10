import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {Network} from 'ethers/utils';



export const network = (config : Network) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : Network) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
