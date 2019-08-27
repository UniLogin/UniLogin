import {Router} from 'express';
import WalletService from '../../integration/ethereum/WalletService';
import MessageHandler from '../../core/services/MessageHandler';
import {SignedMessage, DeployArgs} from '@universal-login/commons';
import {asyncHandler, sanitize, responseOf, asString, asObject} from '@restless/restless';
import {asBigNumberish, asArrayish} from '../utils/sanitizers';


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
  async (data: {body: DeployArgs}) => {
    const {publicKey, ensName, gasPrice, signature} = data.body;
    const transaction = await walletContractService.deploy({publicKey, ensName, gasPrice, signature});
    return responseOf(transaction, 201);
  };

export default (walletContractService : WalletService, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/execution', asyncHandler(
    sanitize({
      body: asObject({
        gasToken: asString,
        to: asString,
        from: asString,
        nonce: asString,
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
        gasPrice: asString,
        signature: asString
      })
    }),
    deploy(walletContractService)
  ));

  return router;
};
