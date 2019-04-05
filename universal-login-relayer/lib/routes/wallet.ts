import {Router, Request, Response, NextFunction} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

export const create = (walletContractService : any) => async (req : Request, res : Response, next : NextFunction) => {
  const {managementKey, ensName} = req.body;
  try {
    const transaction = await walletContractService.create(managementKey, ensName);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const execution = (walletContractService : any) => async (req : Request, res : Response, next : NextFunction) => {
  try {
    const transaction = await walletContractService.executeSigned(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const getStatus = (walletContractService: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {hash} = req.params;
    const status = await walletContractService.getStatus(hash);
    res.status(200)
      .type('json')
      .send(JSON.stringify(status));
  } catch (err) {
    next(err);
  }
};

export default (walletContractService : any) => {
  const router = Router();

  router.post('/',
    asyncMiddleware(create(walletContractService)));

  router.post('/execution',
    asyncMiddleware(execution(walletContractService)));

  router.get('/execution/:hash',
    asyncMiddleware(getStatus(walletContractService)));

  return router;
};
