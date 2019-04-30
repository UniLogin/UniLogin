import {utils} from 'ethers';
import {EMPTY_ACCOUNT_ADDRESS, defaultDeployOptions} from '@universal-login/commons';

const transaction: Partial<utils.Transaction> = {
  ...defaultDeployOptions,
  to: EMPTY_ACCOUNT_ADDRESS,
  value: utils.parseEther('1')
};

export default transaction;