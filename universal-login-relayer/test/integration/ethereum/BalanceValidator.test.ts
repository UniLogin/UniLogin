import {BalanceValidator} from '../../../src/integration/ethereum/BalanceValidator';
import {BalanceChecker, ETHER_NATIVE_TOKEN, ProviderService} from '@unilogin/commons';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {NotEnoughBalance} from '../../../src/core/utils/errors';
import {expect} from 'chai';

describe('UNIT: BalanceValidator', () => {
  const balanceChecker = new BalanceChecker({} as ProviderService);
  (balanceChecker as any).getBalance = () => utils.bigNumberify('2');

  const deploymentBalanceChecker = new BalanceValidator(balanceChecker);

  it('Should throw error when balance is not valid', async () => {
    await expect(deploymentBalanceChecker.validate(AddressZero, ETHER_NATIVE_TOKEN.address, utils.bigNumberify('3'))).rejectedWith(NotEnoughBalance);
  });

  it('Should validate with success when balance is valid', async () => {
    await deploymentBalanceChecker.validate(AddressZero, ETHER_NATIVE_TOKEN.address, utils.bigNumberify('1'));
  });
});
