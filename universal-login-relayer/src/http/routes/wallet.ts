import {Router, Request} from 'express';
import MessageHandler from '../../core/services/execution/messages/MessageHandler';
import {SignedMessage, DeployArgs, ApplicationInfo, asDeploymentHash, asApplicationInfo, asStoredFutureWalletRequest, StoredFutureWalletRequest, StoredEncryptedWallet, asStoredEncryptedWallet} from '@unilogin/commons';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject, asNumber, asOptional} from '@restless/sanitizers';
import {asEthAddress, asBigNumber} from '@restless/ethereum';
import {asArrayish} from '../utils/sanitizers';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import DeploymentHandler from '../../core/services/execution/deployment/DeploymentHandler';
import {FutureWalletHandler} from '../../core/services/FutureWalletHandler';
import {ApiKeyHandler} from '../../core/services/execution/ApiKeyHandler';
import {EncryptedWalletHandler} from '../../core/services/EncryptedWalletHandler';
import {RestoreWalletHandler} from '../../core/services/RestoreWalletHandler';

const messageHandling = (messageHandler: MessageHandler, apiKeyHandler: ApiKeyHandler) =>
  async (data: {headers: {api_key: string | undefined}, body: SignedMessage}) => {
    const refundPayerId = await apiKeyHandler.handle(data.headers.api_key, data.body.gasPrice.toString());
    const status = await messageHandler.handle(data.body, refundPayerId);
    return responseOf({status}, 201);
  };

const getMessageStatus = (messageHandler: MessageHandler) =>
  async (data: {messageHash: string}) => {
    const status = await messageHandler.getStatus(data.messageHash);
    return responseOf(status);
  };

const deploymentHandling = (deploymentHandler: DeploymentHandler, apiKeyHandler: ApiKeyHandler) =>
  async (data: {headers: {api_key: string | undefined}, body: DeployArgs & {contractAddress: string, applicationInfo: ApplicationInfo}}, req: Request) => {
    const {contractAddress, applicationInfo, ...deployArgs} = data.body;
    const deviceInfo = getDeviceInfo(req, applicationInfo);
    const apiKey = data.headers.api_key;
    const refundPayerId = await apiKeyHandler.handle(apiKey, deployArgs.gasPrice);
    const deploymentHash = await deploymentHandler.handle(contractAddress, deployArgs, deviceInfo, refundPayerId);
    const status = await deploymentHandler.getStatus(deploymentHash);
    return responseOf(status, 201);
  };

const getDeploymentStatus = (deploymentHandler: DeploymentHandler) =>
  async (data: {deploymentHash: string}) => {
    const status = await deploymentHandler.getStatus(data.deploymentHash);
    return status ? responseOf(status, 200) : responseOf('Not Found', 404);
  };

const futureWalletHandling = (futureWalletHandler: FutureWalletHandler) =>
  async (data: {body: StoredFutureWalletRequest}) => {
    const [contractAddress] = await futureWalletHandler.handle(data.body);
    return responseOf({contractAddress}, 201);
  };

const encryptedWalletHandling = (encryptedWalletHandler: EncryptedWalletHandler) =>
  async (data: {headers: {code: string}, body: StoredEncryptedWallet}) => {
    const email = await encryptedWalletHandler.handle(data.body, data.headers.code);
    return responseOf({email}, 201);
  };

const restoreWalletHandling = (restoreWalletHandler: RestoreWalletHandler) =>
  async (data: {email: string, headers: {code: string}}) => {
    const storedEncryptedWallet = await restoreWalletHandler.handle(data.email, data.headers.code);
    return responseOf(storedEncryptedWallet, 200);
  };

export default (
  deploymentHandler: DeploymentHandler,
  messageHandler: MessageHandler,
  futureWalletHandler: FutureWalletHandler,
  apiKeyHandler: ApiKeyHandler,
  encryptedWalletHandler: EncryptedWalletHandler,
  restoreWalletHandler: RestoreWalletHandler,
) => {
  const router = Router();

  router.post('/execution', asyncHandler(
    sanitize({
      headers: asObject({api_key: asOptional(asString)}),
      body: asObject({
        gasToken: asString,
        to: asEthAddress,
        from: asEthAddress,
        nonce: asString,
        safeTxGas: asBigNumber,
        gasPrice: asBigNumber,
        baseGas: asBigNumber,
        data: asArrayish,
        value: asBigNumber,
        signature: asString,
        operationType: asNumber,
        refundReceiver: asEthAddress,
      }),
    }),
    messageHandling(messageHandler, apiKeyHandler),
  ));

  router.get('/execution/:messageHash', asyncHandler(
    sanitize({
      messageHash: asString,
    }),
    getMessageStatus(messageHandler),
  ));

  router.post('/deploy', asyncHandler(
    sanitize({
      headers: asObject({api_key: asOptional(asString)}),
      body: asObject({
        publicKey: asEthAddress,
        ensName: asString,
        gasPrice: asString,
        gasToken: asString,
        signature: asString,
        applicationInfo: asApplicationInfo,
        contractAddress: asString,
      }),
    }),
    deploymentHandling(deploymentHandler, apiKeyHandler),
  ));

  router.get('/deploy/:deploymentHash', asyncHandler(
    sanitize({
      deploymentHash: asDeploymentHash,
    }),
    getDeploymentStatus(deploymentHandler),
  ));

  router.post('/future', asyncHandler(
    sanitize({
      body: asStoredFutureWalletRequest,
    }),
    futureWalletHandling(futureWalletHandler),
  ));

  router.post('/encrypted', asyncHandler(
    sanitize({
      headers: asObject({code: asString}),
      body: asStoredEncryptedWallet,
    }),
    encryptedWalletHandling(encryptedWalletHandler),
  ));

  router.get('/restore/:email', asyncHandler(
    sanitize({
      headers: asObject({code: asString}),
      email: asString,
    }),
    restoreWalletHandling(restoreWalletHandler),
  ));

  return router;
};
