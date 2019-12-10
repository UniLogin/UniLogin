import {ETHER_NATIVE_TOKEN, SerializableFutureWallet, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {providers, utils, Wallet} from 'ethers';
import UniversalLoginSDK, {FutureWallet} from '../../lib';
import {ENSService} from '../../lib/integration/ethereum/ENSService';

describe('UNIT: FutureWallet', () => {
  const serializableFutureWallet: SerializableFutureWallet = {
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };
  const minimalAmount = utils.parseEther('0.5').toString();
  const supportedTokens = [
    {
      address: ETHER_NATIVE_TOKEN.address,
      minimalAmount,
    },
  ];
  let provider: providers.Provider;
  let wallet: Wallet;
  let futureWallet: FutureWallet;
  let mockSDK: UniversalLoginSDK;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    mockSDK = {
      provider: provider,
    } as any;

    futureWallet = new FutureWallet(serializableFutureWallet, supportedTokens, mockSDK, {} as ENSService);
  });

  it('waits for Balance', async () => {
    await wallet.sendTransaction({to: serializableFutureWallet.contractAddress, value: utils.parseEther('2')});
    const result = await futureWallet.waitForBalance();
    expect(await wallet.getBalance()).to.be.above(minimalAmount);
    expect(result.contractAddress).be.eq(serializableFutureWallet.contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });
});
