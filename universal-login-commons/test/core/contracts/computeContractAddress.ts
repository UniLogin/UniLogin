import {expect} from 'chai';
import {computeContractAddress} from '../../../lib';
import {getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import {MockToken} from '../..';

describe('UNIT: computeContractAddress', () => {
  function testFor(walletAddress: string, nonce: number, expectedAddress: string) {
    it(`for nonce ${nonce} computedContractAddress is ${expectedAddress}`, () => {
      expect(computeContractAddress(walletAddress, nonce)).to.eq(expectedAddress);
    });
  };

  const testWalletAddress = '0xd59ca627Af68D29C547B91066297a7c469a7bF72';

  testFor(testWalletAddress, 0, '0x1b9B96a9BAc7dF3cC3fb886F621520844d0a5887');
  testFor(testWalletAddress, 1, '0xe3cD8500f426A2FeC2900EBd36D0f06a2372A9d2');
  testFor(testWalletAddress, 2, '0x5D3326e0c2e4E94bFCB149e7a38dAd5AA6123eB8');
  testFor(testWalletAddress, 3, '0xaB315F335D8879a319e0213422424b9057098372');
  testFor(testWalletAddress, 4, '0xaa4D9d2B29720DdCC6C0236715aCbF7f28E7B383');
  testFor(testWalletAddress, 5, '0xEb2dc36d203F09A372E6cF776A5C3F96bb71a4D4');
  testFor(testWalletAddress, 6, '0x48b548020E931ef6082B41cFc160cb58B02F3c11');
  testFor(testWalletAddress, 7, '0x4458aD0F44bDcFAf59Eb0FfE42730C43aFAD1763');
  testFor(testWalletAddress, 8, '0xaDd29988968B28646e30f2A98387C1ea43AEBa53');

  testFor('0x6763ae279735330de79a73d2add09424927bc121', 147, '0xe82B66980B06B75Dd802bDFaFac9185bE5ACF453');
  testFor('0x6763ae279735330de79a73d2add09424927bc121', 262, '0xBc54aB885fA044362a8ce32909852C535687fb9d');
  testFor('0x6763ae279735330de79a73d2add09424927bc121', 1842, '0xe4Af30ea54269c8796832E802f6C029eA7703539');
  testFor('0x6763ae279735330de79a73d2add09424927bc121', 4445, '0x23b30dE23F788ED7AC1d7Cfa9dC95f1c24AB5633');
});

describe('INT: computeContractAddress', () => {
  const [wallet] = getWallets(createMockProvider());

  function test(nonce: number) {
    it(`deployed contract has computed address for nonce ${nonce}`, async () => {
      const contract = await deployContract(wallet, MockToken);
      const expectedAddress = computeContractAddress(wallet.address, nonce);
      expect(contract.address).to.eq(expectedAddress);
    });
  }

  for(let count = 0; count < 20; count++) {
    test(count);
  }
});
