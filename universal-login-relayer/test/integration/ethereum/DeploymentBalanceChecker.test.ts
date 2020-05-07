import {DeploymentBalanceChecker} from '../../../src/integration/ethereum/DeploymentBalanceChecker';
import {BalanceChecker, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {utils} from 'ethers';
import {Provider} from 'ethers/providers';
import {AddressZero} from 'ethers/constants';
import {NotEnoughBalance} from '../../../src/core/utils/errors';
import {expect} from 'chai';

describe('UNIT: DeploymentBalanceChecker', () => {
  const balanceChecker = new BalanceChecker({} as Provider);
  (balanceChecker as any).getBalance = () => {
    return utils.bigNumberify('2');
  };
  const deploymentBalanceChecker = new DeploymentBalanceChecker(balanceChecker);

  it('Should throw error when balance is not valid', async () => {
    await expect(deploymentBalanceChecker.validateBalance(AddressZero, ETHER_NATIVE_TOKEN.address, utils.bigNumberify('3'))).rejectedWith(NotEnoughBalance);
  });

  it('Should validate with success when balance is valid', async () => {
    expect(await deploymentBalanceChecker.validateBalance(AddressZero, ETHER_NATIVE_TOKEN.address, utils.bigNumberify('1'))).to.eq(utils.bigNumberify('2'));
  });
});
