import {expect} from 'chai';
import ERC1271Utils from '../../../build/ERC1271Utils.json';
import {Contract} from 'ethers';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';

describe('ERC1271Utils', async () => {
  let erc1271Utils : Contract;
  const [wallet] = getWallets(createMockProvider());

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
