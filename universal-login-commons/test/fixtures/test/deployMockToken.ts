import {expect} from 'chai';
import {deployMockToken} from '../deployMockToken';
import {utils} from 'ethers';
import {createMockProvider, createFixtureLoader} from 'ethereum-waffle';

describe('deployMockToken', () => {
  it('should deploy mock token', async () => {
    const provider = createMockProvider();
    const {mockTokenContract} = await createFixtureLoader(provider)(deployMockToken);
    await mockTokenContract.transfer('0x0000000000000000000000000000000000000001', utils.parseEther('1.0'));
    expect(await mockTokenContract.balanceOf('0x0000000000000000000000000000000000000001')).to.deep.eq(utils.parseEther('1.0'));
  });
});
