import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {messageSignature} from './utils';
import {utils, Wallet} from 'ethers';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('Tools test', async () => {
  let provider;
  let wallet;
  const value = utils.parseEther('0.1');
  const data = utils.hexlify(0);
  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  it('Should return correct message signature', async () => {
    const signature = await messageSignature(wallet, wallet.address, value, data);
    const message = utils.arrayify(utils.solidityKeccak256(['address', 'uint256', 'bytes'],[wallet.address, value, data]));
    expect(Wallet.verifyMessage(message, signature)).to.eq(wallet.address);
  });
});
