import {Router, Request} from 'express';
import MessageHandler from '../../core/services/execution/messages/MessageHandler';
import {SignedMessage, DeployArgs, ApplicationInfo, asDeploymentHash} from '@universal-login/commons';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject, asNumber} from '@restless/sanitizers';
import {asEthAddress, asBigNumber} from '@restless/ethereum';
import {asArrayish, asApplicationInfo} from '../utils/sanitizers';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import DeploymentHandler from '../../core/services/execution/deployment/DeploymentHandler';

const messageHandling = (messageHandler: MessageHandler) =>
  async (data: {body: SignedMessage}) => {
    const status = await messageHandler.handleMessage(data.body);
    console.log(status);
    return responseOf({status}, 201);
  };

const getMessageStatus = (messageHandler: MessageHandler) =>
  async (data: {messageHash: string}) => {
    const status = await messageHandler.getStatus(data.messageHash);
    return responseOf(status);
  };

const deploymentHandling = (deploymentHandler: DeploymentHandler) =>
  async (data: {body: DeployArgs & {applicationInfo: ApplicationInfo}}, req: Request) => {
    const {applicationInfo, ...deployArgs} = data.body;
    const deviceInfo = getDeviceInfo(req, applicationInfo);
    const deploymentHash = await deploymentHandler.handleDeployment(deployArgs, deviceInfo);
    const status = await deploymentHandler.getStatus(deploymentHash);
    return responseOf(status, 201);
  };

const getDeploymentStatus = (deploymentHandler: DeploymentHandler) =>
  async (data: {deploymentHash: string}) => {
    const status = await deploymentHandler.getStatus(data.deploymentHash);
    return status ? responseOf(status, 200) : responseOf('Not Found', 404);
  };

export default (deploymentHandler: DeploymentHandler, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/execution', asyncHandler(
    sanitize({
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
    messageHandling(messageHandler),
  ));

  router.get('/execution/:messageHash', asyncHandler(
    sanitize({
      messageHash: asString,
    }),
    getMessageStatus(messageHandler),
  ));

  router.post('/deploy', asyncHandler(
    sanitize({
      body: asObject({
        publicKey: asEthAddress,
        ensName: asString,
        gasPrice: asString,
        gasToken: asString,
        signature: asString,
        applicationInfo: asApplicationInfo,
      }),
    }),
    deploymentHandling(deploymentHandler),
  ));

  router.get('/deploy/:deploymentHash', asyncHandler(
    sanitize({
      deploymentHash: asDeploymentHash,
    }),
    getDeploymentStatus(deploymentHandler),
  ));

  return router;
};
