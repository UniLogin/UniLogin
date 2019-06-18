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
    const status = await messageHandler.handleMessage(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({status}));
  } catch (err) {
    next(err);
  }
};

export const getStatus = (messageHandler: MessageHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {messageHash} = req.params;
    const status = await messageHandler.getStatus(messageHash);
    res.status(200)
      .type('json')
      .send(JSON.stringify(status));
  } catch (err) {
    next(err);
  }
};

const deploy = (walletContractService : WalletService) => async (req: Request, res: Response, next: NextFunction) => {
  const trans = await walletContractService.deploy(req.body.publicKey, req.body.ensName);
  res.status(201)
    .type('json')
    .send(trans);
}

export default (walletContractService : WalletService, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/',
    asyncMiddleware(create(walletContractService)));

  router.post('/execution',
    asyncMiddleware(execution(messageHandler)));

  router.get('/execution/:messageHash',
    asyncMiddleware(getStatus(messageHandler)));

  router.post('/deploy',
    asyncMiddleware(deploy(walletContractService)));

  return router;
};
