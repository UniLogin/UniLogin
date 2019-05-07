import {Router, Request, Response, NextFunction} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import WalletService from '../services/WalletService';
import TransactionService from '../services/transactions/TransactionService';

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

export const execution = (
transactionService : TransactionService) => async (req : Request, res : Response, next : NextFunction) => {
  try {
    const transaction = await transactionService.executeSigned(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const getStatus = (transactionContractService: TransactionService) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {hash} = req.params;
    const status = await transactionContractService.getStatus(hash);
    res.status(200)
      .type('json')
      .send(JSON.stringify(status));
  } catch (err) {
    next(err);
  }
};

export default (walletContractService : WalletService, transactionService: TransactionService) => {
  const router = Router();

  router.post('/',
    asyncMiddleware(create(walletContractService)));

  router.post('/execution',
    asyncMiddleware(execution(transactionService)));

  router.get('/execution/:hash',
    asyncMiddleware(getStatus(transactionService)));

  return router;
};
