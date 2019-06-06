import {Router, Request, Response, NextFunction} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import WalletService from '../services/WalletService';
import MessageHandler from '../services/MessageHandler';

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
messageHandler : MessageHandler) => async (req : Request, res : Response, next : NextFunction) => {
  try {
    const transaction = await messageHandler.handleMessage(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const getStatus = (messageHandler: MessageHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {hash} = req.params;
    const status = await messageHandler.getStatus(hash);
    res.status(200)
      .type('json')
      .send(JSON.stringify(status));
  } catch (err) {
    next(err);
  }
};

export const getStatusById = (messageHandler: MessageHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const messageEntity = await messageHandler.getQueueStatus(id);
    const status = messageEntity && {
      transactionHash: messageEntity.hash,
      error: messageEntity.error
    };
    res.status(200)
      .type('json')
      .send(JSON.stringify(status));
  } catch (err) {
    next(err);
  }
};

export default (walletContractService : WalletService, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/',
    asyncMiddleware(create(walletContractService)));

  router.post('/execution',
    asyncMiddleware(execution(messageHandler)));

  router.get('/execution/:hash',
    asyncMiddleware(getStatus(messageHandler)));

  router.get('/execution/status/:id',
    asyncMiddleware(getStatusById(messageHandler)));

  return router;
};
