import {expect} from 'chai';
import {deployMockToken} from '../deployMockToken';
import {utils} from 'ethers';
import {MockProvider, createFixtureLoader} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS} from '../../../src';

describe('deployMockToken', () => {
  it('should deploy mock token', async () => {
    const provider = new MockProvider();
    const {mockTokenContract} = await createFixtureLoader(provider)(deployMockToken);
    await mockTokenContract.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('1.0'));
    expect(await mockTokenContract.balanceOf(TEST_ACCOUNT_ADDRESS)).to.deep.eq(utils.parseEther('1.0'));
  });
});
