import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import {utils} from 'ethers';



export const network = (config : utils.Network) => async (req : Request, res : Response) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config : utils.Network) => {
  const router = Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
