import {Router, Request, Response, NextFunction} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import WalletService from '../services/WalletService';

export const create = (walletContractService : WalletService) => async (req : Request, res : Response, next : NextFunction) => {
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

export const execution = (walletContractService : WalletService) => async (req : Request, res : Response, next : NextFunction) => {
  try {
    const transaction = await walletContractService.executeSigned(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
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

  return router;
};
