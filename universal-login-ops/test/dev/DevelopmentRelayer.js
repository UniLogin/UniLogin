import chai from 'chai';
import DevelopmentRelayer from '../../src/dev/DevelopmentRelayer';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {waitUntil} from 'universal-login-commons';
import {utils} from 'ethers';
import {startRelayer} from '../helpers/startRelayer';
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
