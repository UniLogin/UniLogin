import {Router} from 'express';
import WalletService from '../services/WalletService';
import MessageHandler from '../services/MessageHandler';
import {SignedMessage} from '@universal-login/commons';
import {asyncHandler, sanitize, responseOf, asString, asObject, asNumber} from '@restless/restless';
import {asBigNumberish, asAny, asArrayish, asStringOrNumber} from '../utils/restlessHelper';

const create = (walletContractService : WalletService) =>
  async (data: {body: {managementKey: string, ensName: string}}) => {
    const transaction = await walletContractService.create(data.body.managementKey, data.body.ensName);
    return responseOf({transaction}, 201);
  };

const execution = (messageHandler : MessageHandler) =>
  async (data: {body: SignedMessage}) => {
    const status = await messageHandler.handleMessage(data.body);
    return responseOf({status}, 201);
  };

const getStatus = (messageHandler: MessageHandler) =>
  async (data: {messageHash: string}) => {
    const status = await messageHandler.getStatus(data.messageHash);
    return responseOf(status);
  };

const deploy = (walletContractService: WalletService) =>
  async (data: {body: {publicKey: string, ensName: string,  overrideOptions: {}}}) => {
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

  router.post('/execution', asyncHandler(
    sanitize({
      body: asObject({
        gasToken: asString,
        operationType: asNumber,
        to: asString,
        from: asString,
        nonce: asStringOrNumber,
        gasLimit: asBigNumberish,
        gasPrice: asBigNumberish,
        data: asArrayish,
        value: asBigNumberish,
        signature: asString
      })
    }),
    execution(messageHandler)
  ));

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
