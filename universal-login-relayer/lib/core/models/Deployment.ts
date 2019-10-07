import {DeployArgs, DeviceInfo, MessageState} from '@universal-login/commons';

export default interface Deployment extends DeployArgs {
  hash: string;
  deviceInfo: DeviceInfo;
  transactionHash: string | null;
  error: string | null;
  state: MessageState;
}
