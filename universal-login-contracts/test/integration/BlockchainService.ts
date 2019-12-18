import {expect} from 'chai';
import {getWallets, loadFixture} from 'ethereum-waffle';
import {getDeployedBytecode, TEST_ACCOUNT_ADDRESS, getContractHash, WALLET_MASTER_VERSIONS} from '@universal-login/commons';
import {mockProviderWithBlockNumber} from '@universal-login/commons/testutils';
import {deployWalletContract} from '../../lib/beta2/deployMaster';
import WalletContract from '../../build/Wallet.json';
import {BlockchainService} from '../../lib/integration/BlockchainService';
import {providers, Contract, Wallet} from 'ethers';
import walletAndProxy from '../fixtures/walletAndProxy';
import basicWalletAndProxy from '../fixtures/basicWalletAndProxy';

describe('INT: BlockchainService', async () => {
  const expectedBytecode = `0x${getDeployedBytecode(WalletContract as any)}`;
  let blockchainService: BlockchainService;
  let provider: providers.Provider;
  let deployer: Wallet;
  let walletContractProxy: Contract;

  before(async () => {
    ({provider, walletContractProxy} = await loadFixture(walletAndProxy));
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
      address: '0xaC8444e7d45c34110B34Ed269AD86248884E78C7',
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

  it('returns proper wallet version', async () => {
    const walletMasterBytecodeHash = getContractHash(WalletContract as any);
    expect(await blockchainService.fetchWalletVersion(walletContractProxy.address)).to.eq((WALLET_MASTER_VERSIONS as any)[walletMasterBytecodeHash]);
  });

  it('throws error if wallet is not supported', async () => {
    const {provider, walletProxy} = await loadFixture(basicWalletAndProxy);
    blockchainService = new BlockchainService(provider);
    expect(blockchainService.fetchWalletVersion(walletProxy.address)).to.be.eventually.rejectedWith('Unsupported wallet master version');
  });

  it('fetchHardforkVersion for default provider', async () => {
    expect(await blockchainService.fetchHardforkVersion()).to.eq('constantinople');
  });

  it('fetchHardforkVersion for mocked mainnet provider before istanbul', async () => {
    const mockProvider = mockProviderWithBlockNumber('homestead', 1);
    blockchainService = new BlockchainService(mockProvider as providers.Provider);
    expect(await blockchainService.fetchHardforkVersion()).to.eq('constantinople');
  });

  it('fetchHardforkVersion for mocked mainnet provider after istanbul', async () => {
    const mockProvider = mockProviderWithBlockNumber('homestead', 10000000000);
    blockchainService = new BlockchainService(mockProvider as providers.Provider);
    expect(await blockchainService.fetchHardforkVersion()).to.eq('istanbul');
  });

  it('fetchHardforkVersion for mocked kovan provider', async () => {
    const mockProvider = mockProviderWithBlockNumber('kovan', 1);
    blockchainService = new BlockchainService(mockProvider as providers.Provider);
    expect(await blockchainService.fetchHardforkVersion()).to.eq('istanbul');
  });
});
