import {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {ProviderService} from '../../../src/integration/ethereum/ProviderService';
import {mockProviderWithBlockNumber} from '../../helpers/mockProvider';
import {MockProvider, deployContract} from 'ethereum-waffle';
import {getDeployedBytecode} from '../../../src/core/utils/contracts/contractHelpers';
import {TEST_ACCOUNT_ADDRESS} from '../../../src/core/constants/test';
import sinon from 'sinon';
import {mineBlock} from '../../helpers/mineBlock';
import MockedTokens from '../../fixtures/MockToken.json';
import {MockToken} from '../..';

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
    it('getCode returns 0x if contract does not exist', async () => {
      const bytecode = await providerService.getCode(TEST_ACCOUNT_ADDRESS);
      expect(bytecode).to.eq('0x');
    });

    it('getCode returns bytecode of existing contract', async () => {
      const {address} = await deployContract(deployer, MockToken);
      expect(await providerService.getCode(address)).to.eq(expectedBytecode);
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
      const mockProvider = mockProviderWithBlockNumber('homestead', 1);
      providerService = new ProviderService(mockProvider as providers.Provider);
      expect(await providerService.fetchHardforkVersion()).to.eq('constantinople');
    });

    it('mocked mainnet provider after istanbul', async () => {
      const mockProvider = mockProviderWithBlockNumber('homestead', 10000000000);
      providerService = new ProviderService(mockProvider as providers.Provider);
      expect(await providerService.fetchHardforkVersion()).to.eq('istanbul');
    });

    it('mocked kovan provider', async () => {
      const mockProvider = mockProviderWithBlockNumber('kovan', 1);
      providerService = new ProviderService(mockProvider as providers.Provider);
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
  });
});
