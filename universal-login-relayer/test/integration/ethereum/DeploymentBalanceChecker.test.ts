import {DeploymentBalanceChecker} from '../../../src/integration/ethereum/DeploymentBalanceChecker'
import {BalanceChecker} from '@unilogin/commons';
import {utils} from 'ethers';
import {Provider} from 'ethers/providers';

describe('UNIT: DeploymentBalanceChecker', () => {
  const balanceChecker = new BalanceChecker({} as Provider);
  (balanceChecker as any).getBalance = () => {
    return utils.bigNumberify('3');
  }


  const deploymentBalanceChecker = new DeploymentBalanceChecker(balanceChecker);

  it('Should throw error when balance is not valid', () => {

  });

  it('Should validate with success when balance is valid', () => {

  });

});