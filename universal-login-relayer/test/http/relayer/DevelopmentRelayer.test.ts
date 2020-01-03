import {waitUntil} from '@universal-login/commons';
import chai from 'chai';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {Contract, providers, utils} from 'ethers';
import {DevelopmentRelayer} from '../../../src/http/relayers/DevelopmentRelayer';
import {WalletCreator} from '../../testhelpers/WalletCreator';
const {startRelayer} = require('../../testhelpers/startRelayer');

chai.use(solidity);

describe('INT: Development Relayer', async () => {
  let provider: providers.Provider;
  let wallet;
  let relayer: DevelopmentRelayer;
  let tokenContract: Contract;
  let contractAddress: string;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, tokenContract} = await startRelayer(wallet, DevelopmentRelayer));
    const walletCreator = new WalletCreator(relayer as any, wallet);
    ({contractAddress} = await walletCreator.deployWallet());
  });

  const isBalanceEqual = (value: utils.BigNumber) => async () =>
    (await provider.getBalance(contractAddress)).gte(value);

  const isTokenBalanceEqual = (value: utils.BigNumber) => async () =>
    (await tokenContract.balanceOf(contractAddress)).eq(value);

  it('Grants 100 ether to newly created wallet contract', async () => {
    await waitUntil(isBalanceEqual(utils.parseEther('100')) as any, 5, 300);
  });

  it('Grants 100 tokens to newly created wallet contract', async () => {
    await waitUntil(isTokenBalanceEqual(utils.parseEther('100')) as any, 5, 300);
  });

  afterEach(async () => {
    await relayer.stopLater();
  });
});
