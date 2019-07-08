import chai, {expect} from 'chai';
import {TokenGrantingRelayer} from '../../../../lib/http/relayers/TokenGrantingRelayer';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import UniversalLoginSDK from '@universal-login/sdk';
import {waitUntil} from '@universal-login/commons';
import {utils} from 'ethers';
import {startRelayer} from '../../../helpers/startRelayer';
chai.use(solidity);

describe('INT: Token Granting Relayer', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let relayer;
  let tokenContract;
  let sdk;
  let walletContractPrivateKey;
  let walletContractAddress;

  const relayerUrl = 'http://localhost:33511';

  beforeEach(async () => {
    ({relayer, tokenContract} = await startRelayer(wallet, TokenGrantingRelayer));
    sdk = new UniversalLoginSDK(relayerUrl, provider);
    [walletContractPrivateKey, walletContractAddress] = await sdk.create('ja.mylogin.eth');
  });

  const isTokenBalanceGreater = (value) => async () =>
    (await tokenContract.balanceOf(walletContractAddress)).gt(utils.parseEther(value));

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(walletContractAddress)).eq(value);


  describe('Token granting', async () => {
    it('Grants 100 tokens on contract creation', async () => {
      await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
    });

    it('Grants 5 tokens on key add', async () => {
      const {waitToBeMined} = await sdk.addKey(walletContractAddress, wallet.address, walletContractPrivateKey, {gasToken: tokenContract.address});
      await waitToBeMined();
      await waitUntil(isTokenBalanceGreater('104'), 5, 50);
      const actualBalance = await tokenContract.balanceOf(walletContractAddress);
      expect(actualBalance).to.be.above(utils.parseEther('104'));
    });
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
