import {expect} from 'chai';
import ERC1271Utils from '../../../dist/contracts/ERC1271Utils.json';
import {Contract} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';

describe('Contract: ERC1271Utils', async () => {
  let erc1271Utils: Contract;
  const [wallet] = new MockProvider().getWallets();

  before(async () => {
    erc1271Utils = await deployContract(wallet, ERC1271Utils);
  });

  it('getMagicValue()', async () => {
    expect(await erc1271Utils.getMagicValue()).to.eq('0x20c13b0b');
  });

  it('getInvalidSignature()', async () => {
    expect(await erc1271Utils.getInvalidSignature()).to.eq('0xffffffff');
  });
});
