import {expect} from 'chai';
import {utils, Contract} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getDeployData} from '@universal-login/contracts';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {FutureWalletFactory} from '../../lib/services/FutureWalletFactory';

describe('INT: FutureWalletFactory', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  const supportedTokens = [{
    address: ETHER_NATIVE_TOKEN.address,
    minimalAmount: utils.parseEther('0.05').toString()
  }];
  let walletMaster: Contract;
  let factoryContract: Contract;
  let futureWalletFactory: FutureWalletFactory;

  before(async () => {
    walletMaster = await deployContract(wallet, WalletMaster);
    const initCode = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
    factoryContract = await deployContract(wallet, Factory, [initCode]);
    futureWalletFactory = new FutureWalletFactory(factoryContract.address, provider, supportedTokens);
  });

  it('resolve promise when address will have balance', async () => {
    const {waitForBalance, contractAddress} = (await futureWalletFactory.getFutureWallet());
    setTimeout(() => wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')}), 50);
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });
});
