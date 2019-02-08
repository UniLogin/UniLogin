const {expect} = require('chai');
const chai = require('chai');
const TokenGrantingRelayer = require('../../src/dev/TokenGrantingRelayer');
const {getWallets, createMockProvider, solidity} = require('ethereum-waffle');
const UniversalLoginSDK = require('universal-login-sdk').default;
const {waitUntil} = require('universal-login-contracts');
const {utils} = require('ethers');
const {startRelayer} = require('../helpers/startRelayer');
chai.use(solidity);

describe('Token Granting Relayer', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let relayer;
  let tokenContract;
  let sdk;
  let identityPrivateKey;
  let walletContractAddress;

  const relayerUrl = 'http://localhost:33511';

  before(async () => {
    ({relayer, tokenContract} = await startRelayer(wallet, TokenGrantingRelayer));
    sdk = new UniversalLoginSDK(relayerUrl, provider);
    [identityPrivateKey, walletContractAddress] = await sdk.create('ja.mylogin.eth');
  });

  const isTokenBalanceGreater = (value) => async () =>
    (await tokenContract.balanceOf(walletContractAddress)).gt(utils.bigNumberify(value));

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(walletContractAddress)).eq(value);


  describe('Token granting', async () => {
    it('Grants 100 tokens on contract creation', async () => {
      await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
    });

    it('Grants 5 tokens on key add', async () => {
      await sdk.addKey(walletContractAddress, wallet.address, identityPrivateKey, {gasToken: tokenContract.address});
      await waitUntil(isTokenBalanceGreater('104'), 5, 50);
      const actualBalance = await tokenContract.balanceOf(walletContractAddress);
      expect(actualBalance).to.be.above(utils.parseEther('104'));
    });
  });

  after(async () => {
    relayer.stop();
  });
});
