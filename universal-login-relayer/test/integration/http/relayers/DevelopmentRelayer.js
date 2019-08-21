import chai from 'chai';
import {utils} from 'ethers';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import {waitUntil} from '@universal-login/commons';
import {DevelopmentRelayer} from '../../../../lib/http/relayers/DevelopmentRelayer';
import {startRelayer} from '../../../helpers/startRelayer';
import {WalletCreator} from '../../../helpers/WalletCreator';

chai.use(solidity);

describe('INT: Development Relayer', async () => {
  let provider;
  let wallet;
  let relayer;
  let tokenContract;
  let contractAddress;

  const relayerUrl = 'http://localhost:33511';

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, tokenContract} = await startRelayer(wallet, DevelopmentRelayer));
    const walletCreator = new WalletCreator(relayerUrl, wallet);
    ({contractAddress} = await walletCreator.deployWallet());
  });

  const isBalanceEqual = (value) => async () =>
    (await provider.getBalance(contractAddress)).gt(value);

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(contractAddress)).eq(value);

  it('Grants 100 ether to newly created wallet contract', async () => {
    await waitUntil(isBalanceEqual(utils.parseEther('100')), 5, 50);
  });

  it('Grants 100 tokens to newly created wallet contract', async () => {
    await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
  });

  afterEach(async () => {
    await relayer.stopLater();
  });
});
