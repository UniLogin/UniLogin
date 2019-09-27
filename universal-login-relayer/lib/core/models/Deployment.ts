import {DeployArgs} from '@universal-login/commons';

export default interface Deployment extends DeployArgs {
  hash: string;
}
