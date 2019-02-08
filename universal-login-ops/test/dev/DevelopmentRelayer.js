
const chai = require('chai');
const DevelopmentRelayer = require('../../src/dev/DevelopmentRelayer');
const {getWallets, createMockProvider, solidity} = require('ethereum-waffle');
const UniversalLoginSDK = require('universal-login-sdk').default;
const {waitUntil} = require('universal-login-contracts');
const {utils} = require('ethers');
const {startRelayer} = require('../helpers/startRelayer');
chai.use(solidity);

describe('Development Relayer', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let relayer;
  let tokenContract;
  let sdk;
  let walletContractAddress;

  const relayerUrl = 'http://localhost:33511';

  before(async () => {
    ({relayer, tokenContract} = await startRelayer(wallet, DevelopmentRelayer));
    sdk = new UniversalLoginSDK(relayerUrl, provider);
    [, walletContractAddress] = await sdk.create('ja.mylogin.eth');
  });

  const isBalanceEqual = (value) => async () =>
    (await provider.getBalance(walletContractAddress)).eq(value);

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(walletContractAddress)).eq(value);


  it('Grants 100 ether to newly created wallet contract', async () => {
    await waitUntil(isBalanceEqual(utils.parseEther('100')), 5, 50);
  });

  it('Grants 100 tokens to newly created wallet contract', async () => {
    await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
  });

  after(async () => {
    relayer.stop();
  });
});
