import {expect} from 'chai';
import {providers, Contract, utils} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {getDeployedBytecode, DEPLOYMENT_REFUND} from '@universal-login/commons';
import ProxyContract from '@universal-login/contracts/build/WalletProxy.json';
import WalletMasterWithRefund from '@universal-login/contracts/build/Wallet.json';
import {WalletCreator} from '../../helpers/WalletCreator';
import Relayer, {RelayerUnderTest} from '../../../lib';

describe('WalletCreator', () => {
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
    const walletContract = new Contract(contractAddress, WalletMasterWithRefund.interface, provider);
    expect(await walletContract.keyExist(publicKey)).to.be.true;
  });
});
