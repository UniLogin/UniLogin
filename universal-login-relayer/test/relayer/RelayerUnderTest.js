import chai from 'chai';
import {createMockProvider, solidity} from 'ethereum-waffle';
import UniversalLoginSDK from 'universal-login-sdk';
import {waitUntil} from 'universal-login-commons';
import {utils, Contract} from 'ethers';
import {RelayerUnderTest} from '../../lib/utils/relayerUnderTest';
import MockToken from 'universal-login-contracts/build/MockToken';

chai.use(solidity);

describe('Relayer Under Test', async () => {
  const provider = createMockProvider();
  let relayer;
  let tokenContract;
  let sdk;
  let walletContractAddress;

  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    relayer = await RelayerUnderTest.createPreconfigured({provider, overridePort: relayerPort});
    await relayer.start();
    sdk = new UniversalLoginSDK(relayerUrl, provider);
    [, walletContractAddress] = await sdk.create('ja.mylogin.eth');
    tokenContract = new Contract(relayer.config.tokenContractAddress, MockToken.interface, provider);
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
    await relayer.stop();
  });
});
