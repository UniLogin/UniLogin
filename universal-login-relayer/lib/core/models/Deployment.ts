import {DeployArgs, DeviceInfo, DeploymentState} from '@universal-login/commons';

interface Deployment extends DeployArgs {
  hash: string;
  deviceInfo: DeviceInfo;
  transactionHash: string | null;
  error: string | null;
  state: DeploymentState;
}

export default Deployment;
