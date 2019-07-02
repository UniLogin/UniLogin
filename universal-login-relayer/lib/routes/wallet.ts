import {Router, Request, Response, NextFunction} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import WalletService from '../services/WalletService';
import MessageHandler from '../services/MessageHandler';
import {asyncHandler, sanitize, responseOf, asString, asObject, asNumber, asArray, Either} from '@restless/restless';
import {asBigNumberish, asAny, asArrayish} from '../utils/restlessHelper';

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

const create = (walletContractService : WalletService) =>
  async (data: any) => {
    const transaction = await walletContractService.create(data.body.managementKey, data.body.ensName);
    return responseOf({transaction}, 201);
  };

const getStatus = (messageHandler: MessageHandler) =>
  async (data: any) => {
    const status = await messageHandler.getStatus(data.messageHash);
    return responseOf(status);
  };

const deploy = (walletContractService: WalletService) =>
  async (data: any) => {
    const trans = await walletContractService.deploy(data.body.publicKey, data.body.ensName, data.body.overrideOptions);
    return responseOf(trans, 201);
  };

export default (walletContractService : WalletService, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      body: asObject({
        managementKey: asString,
        ensName: asString,
        overrideOptions: asAny
      })
    }),
    create(walletContractService)
  ));

  // router.post('/execution', asyncHandler(
  //   sanitize({
  //     body: asObject({
  //       gasToken: asString,
  //       operationType: asNumber,
  //       to: asString,
  //       from: asString,
  //       nonce: asNumber,
  //       gasLimit: asBigNumberish,
  //       gasPrice: asBigNumberish,
  //       data: asArrayish,
  //       value: asBigNumberish,
  //       signature: asString
  //     })
  //   }),
  //   async (data: any) => {
  //     const status = await messageHandler.handleMessage(data.body);
  //     return responseOf(status, 201);
  //   }
  // ));


  router.post('/execution', asyncMiddleware(execution(messageHandler)));

  router.get('/execution/:messageHash', asyncHandler(
    sanitize({
      messageHash: asString,
    }),
    getStatus(messageHandler)
  ));

  router.post('/deploy', asyncHandler(
    sanitize({
      body: asObject({
        publicKey: asString,
        ensName: asString,
        overrideOptions: asAny
      })
    }),
    deploy(walletContractService)
  ));

  return router;
};
