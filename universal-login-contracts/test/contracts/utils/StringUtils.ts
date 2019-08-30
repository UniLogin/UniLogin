import {expect} from 'chai';
import StringUtils from '../../../build/StringUtils.json';
import {Contract} from 'ethers';
import {BigNumberish, bigNumberify} from 'ethers/utils';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';


describe('StringUtils', () => {
  let stringUtils : Contract;
  const [wallet] = getWallets(createMockProvider());

  before(async () => {
    stringUtils = await deployContract(wallet, StringUtils);
  });

  describe('uint2str', () => {
    function testFor(input: BigNumberish) {
      it(input.toString(), async () => {
        expect(await stringUtils.uint2str(input)).to.eq(input.toString());
      });
    }

    testFor(0);
    testFor(1);
    testFor(2);
    testFor(11);
    testFor(1322);
    testFor(4000000000);
    testFor('400000000000000000000000000000000');
    testFor(bigNumberify(2).pow(256).sub(1));
  });
});
