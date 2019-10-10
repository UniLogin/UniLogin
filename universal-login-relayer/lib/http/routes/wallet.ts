import {Router, Request} from 'express';
import MessageHandler from '../../core/services/MessageHandler';
import {SignedMessage, DeployArgs, ApplicationInfo} from '@universal-login/commons';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {asEthAddress, asBigNumber} from '@restless/ethereum';
import {asArrayish, asApplicationInfo} from '../utils/sanitizers';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import DeploymentHandler from '../../core/services/DeploymentHandler';


const messageHandling = (messageHandler : MessageHandler) =>
  async (data: {body: SignedMessage}) => {
    const status = await messageHandler.handleMessage(data.body);
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
    const transaction = await deploymentHandler.handleDeployment(deployArgs, deviceInfo);
    return responseOf(transaction, 201);
  };

const getDeploymentStatus = () =>
  async () => {
    return responseOf('Not implemented', 501);
  };

export default (deploymentHandler : DeploymentHandler, messageHandler: MessageHandler) => {
  const router = Router();

  router.post('/execution', asyncHandler(
    sanitize({
      body: asObject({
        gasToken: asString,
        to: asEthAddress,
        from: asEthAddress,
        nonce: asString,
        gasLimitExecution: asBigNumber,
        gasPrice: asBigNumber,
        gasData: asBigNumber,
        data: asArrayish,
        value: asBigNumber,
        signature: asString
      })
    }),
    messageHandling(messageHandler)
  ));

  router.get('/execution/:messageHash', asyncHandler(
    sanitize({
      messageHash: asString,
    }),
    getMessageStatus(messageHandler)
  ));

  router.post('/deploy', asyncHandler(
    sanitize({
      body: asObject({
        publicKey: asEthAddress,
        ensName: asString,
        gasPrice: asString,
        gasToken: asString,
        signature: asString,
        applicationInfo: asApplicationInfo
      })
    }),
    deploymentHandling(deploymentHandler)
  ));

  router.get('/deploy/:deploymentHash', asyncHandler(
    sanitize({
      deploymentHash: asString,
    }),
    getDeploymentStatus()
  ));

  return router;
};
