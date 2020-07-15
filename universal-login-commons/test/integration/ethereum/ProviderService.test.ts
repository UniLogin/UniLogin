import {expect} from 'chai';
import sinon from 'sinon';
import {providers, utils, Wallet} from 'ethers';
import {MockProvider, deployContract} from 'ethereum-waffle';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ProviderService} from '../../../src/integration/ethereum/ProviderService';
import {mockProviderWithBlockNumber} from '../../helpers/mockProvider';
import {getDeployedBytecode} from '../../../src/core/utils/contracts/contractHelpers';
import {TEST_ACCOUNT_ADDRESS, TEST_DAI_TOKEN} from '../../../src/core/constants/test';
import {mineBlock} from '../../helpers/mineBlock';
import MockedTokens from '../../fixtures/MockToken.json';
import {MockToken} from '../..';
import {isAddressIncludedInLog} from '../../../src';

describe('INT: ProviderService', () => {
  const expectedBytecode = `0x${getDeployedBytecode(MockedTokens as any)}`;
  let providerService: ProviderService;
  let provider: MockProvider;
  let deployer: Wallet;

  beforeEach(async () => {
    provider = new MockProvider();
    (provider as any).pollingInterval = 5;
    [deployer] = provider.getWallets();
    providerService = new ProviderService(provider);
  });

  it('getBlockNumber should return increased block number', async () => {
    const blockNumber = await providerService.getBlockNumber();
    expect(blockNumber).at.least(0);
    await deployContract(deployer, MockToken);
    const blockNumber2 = await providerService.getBlockNumber();
    expect(blockNumber2).greaterThan(blockNumber);
    expect(blockNumber2).to.eq(blockNumber + 1);
  });

  it('getLogs should return array of logs if match the logs', async () => {
    const expectedPartOfLog = {
      transactionIndex: 0,
      address: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
      data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
      topics:
        ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff',
        ],
      logIndex: 0,
    };
    const {address} = await deployContract(deployer, MockToken);
    const logs = await providerService.getLogs({address});
    expect(logs).to.have.length(1);
    expect(logs[0]).to.deep.include(expectedPartOfLog);
  });

  it('should return empty array if does not match the logs', async () => {
    expect(await providerService.getLogs({address: TEST_ACCOUNT_ADDRESS})).to.deep.eq([]);
  });

  describe('getCode', () => {
    beforeEach(() => {
      (providerService as any).cachedContractCodes = {};
    });

    it('getCode returns 0x if contract does not exist', async () => {
      const bytecode = await providerService.getCode(TEST_ACCOUNT_ADDRESS);
      expect(bytecode).to.eq('0x');
    });

    it('getCode returns bytecode of existing contract', async () => {
      const {address} = await deployContract(deployer, MockToken);
      expect(await providerService.getCode(address)).to.eq(expectedBytecode);
    });

    it('getCode returns bytecode of existing contract, cache it, and then load it from cache', async () => {
      const addProviderGetCodeSpy = sinon.spy(provider, 'getCode');
      const {address} = await deployContract(deployer, MockToken);
      expect(await providerService.getCode(address)).to.eq(expectedBytecode);
      expect(await providerService.getCode(address)).to.eq(expectedBytecode);
      expect(addProviderGetCodeSpy).to.be.calledOnce;
    });
  });

  describe('isContract', () => {
    it('isContract returns false if contract does not exist', async () => {
      const isContract = await providerService.isContract(TEST_ACCOUNT_ADDRESS);
      expect(isContract).to.be.false;
    });

    it('isContract returns true if contract exists', async () => {
      const {address} = await deployContract(deployer, MockToken);
      const isContract = await providerService.isContract(address);
      expect(isContract).to.be.true;
    });
  });

  describe('fetchHardforkVersion', () => {
    it('default provider', async () => {
      expect(await providerService.fetchHardforkVersion()).to.eq('constantinople');
    });

    it('mocked mainnet provider before istanbul', async () => {
      const mockProvider = mockProviderWithBlockNumber('homestead', 1) as providers.JsonRpcProvider;
      providerService = new ProviderService(mockProvider);
      expect(await providerService.fetchHardforkVersion()).to.eq('constantinople');
    });

    it('mocked mainnet provider after istanbul', async () => {
      const mockProvider = mockProviderWithBlockNumber('homestead', 10000000000) as providers.JsonRpcProvider;
      providerService = new ProviderService(mockProvider);
      expect(await providerService.fetchHardforkVersion()).to.eq('istanbul');
    });

    it('mocked kovan provider', async () => {
      const mockProvider = mockProviderWithBlockNumber('kovan', 1) as providers.JsonRpcProvider;
      providerService = new ProviderService(mockProvider);
      expect(await providerService.fetchHardforkVersion()).to.eq('istanbul');
    });
  });

  describe('handle listeners', () => {
    it('should not call callback after removeListener', async () => {
      const callback = sinon.spy();
      providerService.on('block', callback);
      providerService.removeListener('block', callback);
      await mineBlock(deployer);
      expect(callback.called).to.be.false;
    });

    it('should call callback on new block', async () => {
      const callback = sinon.spy();
      const initialBlockNumber = await providerService.getBlockNumber();
      providerService.on('block', callback);
      await mineBlock(deployer);
      expect(callback.calledTwice).to.be.true;
      expect(callback.getCall(1).calledWith(initialBlockNumber + 1)).to.be.true;
      providerService.removeListener('block', callback);
    });

    it('should call callback multiply times on new blocks', async () => {
      const callback = sinon.spy();
      const expectedCallbackCalls = 4;
      providerService.on('block', callback);
      await mineBlock(deployer);
      await mineBlock(deployer);
      await mineBlock(deployer);
      providerService.removeListener('block', callback);
      expect(callback.lastCall.calledWithExactly(await providerService.getBlockNumber()));
      expect(callback.callCount).to.eq(expectedCallbackCalls);
      expect(callback.firstCall.calledWithExactly(await providerService.getBlockNumber() - expectedCallbackCalls));
    });

    it('recognize if ERC20 balances changed', async () => {
      const tokenContract = await deployContract(deployer, MockToken);
      const initialBlockNumber = await providerService.getBlockNumber();
      const [, wallet] = provider.getWallets();

      const ierc20Interface = new utils.Interface(IERC20.abi);
      const filter = {address: [tokenContract.address, TEST_DAI_TOKEN.address], fromBlock: initialBlockNumber, toBlock: 'latest', topics: [ierc20Interface.events['Transfer'].topic]};

      const sendTokenTransactionResponse = await tokenContract.transfer(wallet.address, utils.bigNumberify('2'));
      await sendTokenTransactionResponse.wait();

      const balance = await tokenContract.balanceOf(wallet.address);
      expect(balance).eq(utils.bigNumberify('2'));

      const {wait} = await wallet.sendTransaction({to: tokenContract.address, data: ierc20Interface.functions.transfer.encode([TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1')])});
      await wait();

      const sendTokenTransactionResponse2 = await tokenContract.transfer(TEST_ACCOUNT_ADDRESS, utils.bigNumberify('1'));
      await sendTokenTransactionResponse2.wait();

      const logs: providers.Log[] = await providerService.getLogs(filter);

      const filteredLogs = logs.filter(isAddressIncludedInLog(wallet.address));
      expect(filteredLogs).length(2);
    });
  });
});
