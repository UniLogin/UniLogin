import {expect} from 'chai';
import {loadFixture, deployContract, MockProvider} from 'ethereum-waffle';
import {getContractHash, WALLET_MASTER_VERSIONS, PROXY_VERSIONS, ProviderService} from '@unilogin/commons';
import MockContract from '../../dist/contracts/MockContract.json';
import {Contract, Wallet} from 'ethers';
import walletAndProxy from '../fixtures/walletAndProxy';
import basicWalletAndProxy from '../fixtures/basicWalletAndProxy';
import {setupGnosisSafeContractFixture} from '../fixtures/gnosisSafe';
import {ContractService} from '../../src';
import {beta2} from '../../src/index';

const {WalletProxy, WalletContract} = beta2;

describe('INT: ContractService', async () => {
  let providerService: ProviderService;
  let contractService: ContractService;
  let provider: MockProvider;
  let deployer: Wallet;
  let walletContractProxy: Contract;

  beforeEach(async () => {
    ({provider, walletContractProxy} = await loadFixture(walletAndProxy));
    (provider as any).pollingInterval = 5;
    [deployer] = provider.getWallets();
    providerService = new ProviderService(provider);
    contractService = new ContractService(providerService);
  });

  describe('fetchProxyVersion', () => {
    it('wallet proxy', async () => {
      const walletProxyBytecodeHash = getContractHash(WalletProxy as any);
      expect(await contractService.fetchProxyVersion(walletContractProxy.address)).to.eq((PROXY_VERSIONS as any)[walletProxyBytecodeHash]);
    });

    it('throws error if proxy is not supported', async () => {
      const contract = await deployContract(deployer, MockContract);
      await expect(contractService.fetchProxyVersion(contract.address)).to.be.eventually.rejectedWith('Unsupported proxy version');
    });

    it('throws error if address is not a contract', async () => {
      const address = Wallet.createRandom().address;
      await expect(contractService.fetchProxyVersion(address)).to.be.eventually.rejectedWith(`Invalid contract address: ${address}`);
    });

    it('gnosis safe proxy', async () => {
      const {provider, proxy} = await loadFixture(setupGnosisSafeContractFixture);
      providerService = new ProviderService(provider);
      contractService = new ContractService(providerService);
      expect(await contractService.fetchProxyVersion(proxy.address)).to.eq('GnosisSafe');
    });
  });

  describe('fetchWalletVersion', () => {
    it('beta2', async () => {
      const walletMasterBytecodeHash = getContractHash(WalletContract as any);
      expect(await contractService.fetchWalletVersion(walletContractProxy.address)).to.eq((WALLET_MASTER_VERSIONS as any)[walletMasterBytecodeHash]);
    });

    it('throws error if wallet is not supported', async () => {
      const {provider, walletProxy} = await loadFixture(basicWalletAndProxy);
      providerService = new ProviderService(provider);
      contractService = new ContractService(providerService);
      await expect(contractService.fetchWalletVersion(walletProxy.address)).to.be.eventually.rejectedWith('Unsupported wallet master version');
    });

    it('gnosis safe', async () => {
      const {provider, proxy} = await loadFixture(setupGnosisSafeContractFixture);
      providerService = new ProviderService(provider);
      contractService = new ContractService(providerService);
      expect(await contractService.fetchWalletVersion(proxy.address)).to.eq('beta3');
    });
  });
});
