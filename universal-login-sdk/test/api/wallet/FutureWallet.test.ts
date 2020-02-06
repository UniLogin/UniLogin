import {ETHER_NATIVE_TOKEN, SerializableFutureWallet, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_GAS_PRICE, DEPLOY_GAS_LIMIT, multiplyBy150Percent} from '@universal-login/commons';
import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {providers, utils, Wallet} from 'ethers';
import UniversalLoginSDK, {FutureWallet} from '../../../src';
import {ENSService} from '../../../src/integration/ethereum/ENSService';
import {AddressZero} from 'ethers/constants';

describe('UNIT: FutureWallet', () => {
  const serializableFutureWallet: SerializableFutureWallet = {
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    ensName: 'name.mylogin.eth',
    gasPrice: TEST_GAS_PRICE,
    gasToken: ETHER_NATIVE_TOKEN.address,
  };
  const minimalAmount = utils.parseEther('0.5').toString();
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
    futureWallet = new FutureWallet(serializableFutureWallet, mockSDK, {} as ENSService, TEST_CONTRACT_ADDRESS);
  });

  it('waits for Balance', async () => {
    const to = serializableFutureWallet.contractAddress;
    await wallet.sendTransaction({to, value: utils.parseEther('2')});
    futureWallet.setSupportedToken({
      address: AddressZero,
      minimalAmount: '1',
    });
    const result = await futureWallet.waitForBalance();
    expect(await provider.getBalance(to)).to.be.above(minimalAmount);
    expect(result.contractAddress).be.eq(to);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('returns minimal amount to deploy', async () => {
    const expectedMinimalAmount = utils.formatEther(multiplyBy150Percent(utils.bigNumberify(TEST_GAS_PRICE).mul(DEPLOY_GAS_LIMIT).toString()));
    expect(futureWallet.getMinimalAmount()).to.eq(expectedMinimalAmount);
  });
});
