import {DEPLOYMENT_REFUND, getDeployedBytecode} from '@universal-login/commons';
import {WalletContractInterface} from '@universal-login/contracts';
import ProxyContract from '@universal-login/contracts/dist/contracts/WalletProxy.json';
import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Contract, providers, utils} from 'ethers';
import Relayer, {RelayerUnderTest} from '../../src';
import {WalletCreator} from './WalletCreator';

describe('INT: WalletCreator', () => {
  let walletCreator: WalletCreator;
  let relayer: Relayer;
  let provider: providers.Provider;

  const relayerPort = '33112';

  beforeEach(async () => {
    provider = createMockProvider();
    const [wallet] = getWallets(provider);
    ({relayer} = await RelayerUnderTest.createPreconfigured(wallet, relayerPort));
    await relayer.start();
    walletCreator = new WalletCreator(relayer as any, wallet);
  });

  afterEach(async () => {
    await relayer.stop();
  });

  it('Creates wallet contract', async () => {
    const applicationWallet = await walletCreator.createFutureWallet();
    expect(applicationWallet.privateKey).to.be.properPrivateKey;
    expect(applicationWallet.contractAddress).to.be.properAddress;
  });

  it('Sends funds to the contract', async () => {
    const initialBalance = utils.parseEther('1');
    const {contractAddress, publicKey} = await walletCreator.deployWallet();
    expect(await provider.getBalance(contractAddress)).to.eq(initialBalance.sub(DEPLOYMENT_REFUND));
    expect(contractAddress).to.be.properAddress;
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract)}`);
    const walletContract = new Contract(contractAddress, WalletContractInterface, provider);
    expect(await walletContract.keyExist(publicKey)).to.be.true;
  });
});
