import {expect} from 'chai';
import sinon from 'sinon';
import {getWallets, loadFixture, deployContract} from 'ethereum-waffle';
import {getDeployedBytecode, TEST_ACCOUNT_ADDRESS, getContractHash, WALLET_MASTER_VERSIONS, PROXY_VERSIONS, TEST_CONTRACT_ADDRESS} from '@universal-login/commons';
import {mockProviderWithBlockNumber} from '@universal-login/commons/testutils';
import {deployWalletContract} from '../../src/beta2/deployMaster';
import WalletContract from '../../dist/contracts/Wallet.json';
import MockContract from '../../dist/contracts/MockContract.json';
import WalletProxy from '../../dist/contracts/WalletProxy.json';
import {BlockchainService} from '../../src/integration/BlockchainService';
import {providers, Contract, Wallet} from 'ethers';
import walletAndProxy from '../fixtures/walletAndProxy';
import basicWalletAndProxy from '../fixtures/basicWalletAndProxy';
import {setupGnosisSafeContractFixture} from '../fixtures/gnosisSafe';
import {computeGnosisCounterfactualAddress} from '../../src';
import {DEPLOY_CONTRACT_NONCE} from '../../src/gnosis-safe@1.1.1/utils';
import {mineBlock} from '../helpers/mineBlock';

describe('INT: BlockchainService', async () => {
  const expectedBytecode = `0x${getDeployedBytecode(WalletContract as any)}`;
  let blockchainService: BlockchainService;
  let provider: providers.Provider;
  let deployer: Wallet;
  let walletContractProxy: Contract;

  beforeEach(async () => {
    ({provider, walletContractProxy} = await loadFixture(walletAndProxy));
    (provider as any).pollingInterval = 5;
    [deployer] = getWallets(provider);
    blockchainService = new BlockchainService(provider);
  });

  it('getCode returns 0x if contract does not existing', async () => {
    const bytecode = await blockchainService.getCode(TEST_ACCOUNT_ADDRESS);
    expect(bytecode).to.be.eq('0x');
  });

  it('getCode returns bytecode of existing contract', async () => {
    const {address} = await deployWalletContract(deployer);
    expect(await blockchainService.getCode(address)).to.be.eq(expectedBytecode);
  });

  it('getBlockNumber should return increased block number', async () => {
    const blockNumber = await blockchainService.getBlockNumber();
    expect(blockNumber).at.least(0);
    await deployWalletContract(deployer);
    const blockNumber2 = await blockchainService.getBlockNumber();
    expect(blockNumber2).greaterThan(blockNumber);
    expect(blockNumber2).to.be.eq(blockNumber + 1);
  });

  it('getLogs should return array of logs if match the logs', async () => {
    const expectedPartOfLog = {
      transactionIndex: 0,
      address: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
      data: '0x',
      topics:
        ['0x654abba5d3170185ed25c9b41f7d2094db3643986b05e9e9cab37028b800ad7e',
          '0x0000000000000000000000000000000000000000000000000000000000000000'],
      logIndex: 0};
    const {address} = await deployWalletContract(deployer);
    const logs = await blockchainService.getLogs({address});
    expect(logs).to.have.length(1);
    expect(logs[0]).to.deep.include(expectedPartOfLog);
  });

  it('should return empty array if does not match the logs', async () => {
    expect(await blockchainService.getLogs({address: TEST_ACCOUNT_ADDRESS})).to.be.deep.eq([]);
  });

  it('creates future gnosis', async () => {
    const initializeData = '0x1234';
    const expectedContractAddress = computeGnosisCounterfactualAddress(TEST_CONTRACT_ADDRESS, DEPLOY_CONTRACT_NONCE, initializeData, TEST_CONTRACT_ADDRESS);
    expect(blockchainService.createFutureGnosis(TEST_CONTRACT_ADDRESS, TEST_CONTRACT_ADDRESS, initializeData)[1]).to.eq(expectedContractAddress);
  });

  describe('fetchProxyVersion', () => {
    it('wallet proxy', async () => {
      const walletProxyBytecodeHash = getContractHash(WalletProxy as any);
      expect(await blockchainService.fetchProxyVersion(walletContractProxy.address)).to.eq((PROXY_VERSIONS as any)[walletProxyBytecodeHash]);
    });

    it('throws error if proxy is not supported', async () => {
      const contract = await deployContract(deployer, MockContract);
      await expect(blockchainService.fetchProxyVersion(contract.address)).to.be.eventually.rejectedWith('Unsupported proxy version');
    });

    it('gnosis safe proxy', async () => {
      const {provider, proxy} = await loadFixture(setupGnosisSafeContractFixture);
      blockchainService = new BlockchainService(provider);
      expect(await blockchainService.fetchProxyVersion(proxy.address)).to.eq('GnosisSafe');
    });
  });

  describe('fetchWalletVersion', () => {
    it('beta2', async () => {
      const walletMasterBytecodeHash = getContractHash(WalletContract as any);
      expect(await blockchainService.fetchWalletVersion(walletContractProxy.address)).to.eq((WALLET_MASTER_VERSIONS as any)[walletMasterBytecodeHash]);
    });

    it('throws error if wallet is not supported', async () => {
      const {provider, walletProxy} = await loadFixture(basicWalletAndProxy);
      blockchainService = new BlockchainService(provider);
      await expect(blockchainService.fetchWalletVersion(walletProxy.address)).to.be.eventually.rejectedWith('Unsupported wallet master version');
    });

    it('gnosis safe', async () => {
      const {provider, proxy} = await loadFixture(setupGnosisSafeContractFixture);
      blockchainService = new BlockchainService(provider);
      expect(await blockchainService.fetchWalletVersion(proxy.address)).to.eq('beta3');
    });
  });

  describe('fetchHardforkVersion', () => {
    it('default provider', async () => {
      expect(await blockchainService.fetchHardforkVersion()).to.eq('constantinople');
    });

    it('mocked mainnet provider before istanbul', async () => {
      const mockProvider = mockProviderWithBlockNumber('homestead', 1);
      blockchainService = new BlockchainService(mockProvider as providers.Provider);
      expect(await blockchainService.fetchHardforkVersion()).to.eq('constantinople');
    });

    it('mocked mainnet provider after istanbul', async () => {
      const mockProvider = mockProviderWithBlockNumber('homestead', 10000000000);
      blockchainService = new BlockchainService(mockProvider as providers.Provider);
      expect(await blockchainService.fetchHardforkVersion()).to.eq('istanbul');
    });

    it('mocked kovan provider', async () => {
      const mockProvider = mockProviderWithBlockNumber('kovan', 1);
      blockchainService = new BlockchainService(mockProvider as providers.Provider);
      expect(await blockchainService.fetchHardforkVersion()).to.eq('istanbul');
    });
  });

  describe('handle listeners', () => {
    it('should not call callback after removeListener', async () => {
      const callback = sinon.spy();
      blockchainService.on('block', callback);
      blockchainService.removeListener('block', callback);
      await mineBlock(deployer);
      expect(callback.called).to.be.false;
    });

    it('should call callback on new block', async () => {
      const callback = sinon.spy();
      const initialBlockNumber = await blockchainService.getBlockNumber();
      blockchainService.on('block', callback);
      await mineBlock(deployer);
      expect(callback.calledOnceWithExactly(initialBlockNumber + 1)).to.be.true;
      blockchainService.removeListener('block', callback);
    });

    it('should call callback multiply times on new blocks', async () => {
      const callback = sinon.spy();
      const expectedCallbackCalls = 3;
      blockchainService.on('block', callback);
      await mineBlock(deployer);
      await mineBlock(deployer);
      await mineBlock(deployer);
      blockchainService.removeListener('block', callback);
      expect(callback.lastCall.calledWithExactly(await blockchainService.getBlockNumber()));
      expect(callback.callCount).to.be.eq(expectedCallbackCalls);
      expect(callback.firstCall.calledWithExactly(await blockchainService.getBlockNumber() - expectedCallbackCalls));
    });
  });
});
