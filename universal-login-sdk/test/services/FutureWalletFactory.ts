import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {getContractWhiteList} from '@universal-login/relayer';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getDeployData} from '@universal-login/contracts';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {FutureWalletFactory} from '../../lib/services/FutureWalletFactory';
import {BlockchainService} from '../../lib/services/BlockchainService';

describe('INT: FutureWalletFactory', async () => {
  let wallet: Wallet;
  let futureWalletFactory: FutureWalletFactory;

  before(async () => {
    const provider = createMockProvider();
    [wallet] = getWallets(provider);
    const supportedTokens = [{
      address: ETHER_NATIVE_TOKEN.address,
      minimalAmount: utils.parseEther('0.05').toString()
    }];
    const walletMaster = await deployContract(wallet, WalletMaster);
    const initCode = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
    const factoryContract = await deployContract(wallet, Factory, [initCode]);
    const blockchainService = new BlockchainService(provider);
    const contractWhiteList = getContractWhiteList();
    const deployCallback =  () => {};
    const futureWalletConfig = {
      factoryAddress: factoryContract.address,
      supportedTokens,
      contractWhiteList
    };
    futureWalletFactory = new FutureWalletFactory(
      futureWalletConfig,
      provider,
      blockchainService,
      deployCallback as any
    );
  });

  it('resolve promise when address will have balance', async () => {
    const {waitForBalance, contractAddress} = (await futureWalletFactory.createFutureWallet());
    setTimeout(() => wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')}), 50);
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });
});
