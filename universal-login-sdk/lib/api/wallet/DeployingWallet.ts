import {MineableStatus} from '@universal-login/commons';
import {SerializedDeployingWallet} from '../..';
import {DeployedWallet} from './DeployedWallet';

export interface DeployingWallet extends SerializedDeployingWallet {
  waitForTransactionHash: () => Promise<MineableStatus>;
  waitToBeSuccess: () => Promise<DeployedWallet>;
}
