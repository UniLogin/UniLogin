import chai, {expect} from 'chai';
import {TokenGrantingRelayer} from '../../../../lib/http/relayers/TokenGrantingRelayer';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import UniversalLoginSDK from '@universal-login/sdk';
import {waitUntil} from '@universal-login/commons';
import {utils} from 'ethers';
import {startRelayer} from '../../../helpers/startRelayer';
import {WalletCreator} from '../../../helpers/WalletCreator';
chai.use(solidity);

describe('INT: Token Granting Relayer', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let relayer;
  let tokenContract;
  let sdk;
  let privateKey;
  let contractAddress;

  const relayerUrl = 'http://localhost:33511';

  beforeEach(async () => {
    ({relayer, tokenContract} = await startRelayer(wallet, TokenGrantingRelayer));
    const walletCreator = new WalletCreator(relayer, wallet);
    ({contractAddress, privateKey} = await walletCreator.deployWallet());
    sdk = new UniversalLoginSDK(relayerUrl, provider);
  });

  const isTokenBalanceGreater = (value) => async () =>
    (await tokenContract.balanceOf(contractAddress)).gt(utils.parseEther(value));

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(contractAddress)).eq(value);


  describe('Token granting', async () => {
    it('Grants 100 tokens on contract creation', async () => {
      await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
    });

    it('Grants 5 tokens on key add', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, wallet.address, privateKey, {gasToken: tokenContract.address});
      await waitToBeMined();
      await waitUntil(isTokenBalanceGreater('104'), 5, 50);
      const actualBalance = await tokenContract.balanceOf(contractAddress);
      expect(actualBalance).to.be.above(utils.parseEther('104'));
    });
  });

  afterEach(async () => {
    await relayer.stopLater();
  });
});
