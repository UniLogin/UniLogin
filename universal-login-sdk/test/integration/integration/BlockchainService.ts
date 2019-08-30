import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {getDeployedBytecode, ContractJSON, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {BlockchainService} from '../../../lib/integration/ethereum/BlockchainService';
import {deployWalletContract} from '@universal-login/contracts';

describe('INT: BlockchainService', async () => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const expectedBytecode = `0x${getDeployedBytecode(WalletContract as ContractJSON)}`;
  const blockchainService = new BlockchainService(provider);

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
        [ '0x654abba5d3170185ed25c9b41f7d2094db3643986b05e9e9cab37028b800ad7e',
          '0x0000000000000000000000000000000000000000000000000000000000000000'],
      logIndex: 0 };
    const {address} = await deployWalletContract(deployer);
    const logs = await blockchainService.getLogs({address});
    expect(logs).to.have.length(1);
    expect(logs[0]).to.deep.include(expectedPartOfLog);
  });

  it('should return empty array if does not match the logs', async () => {
    expect(await blockchainService.getLogs({address: TEST_ACCOUNT_ADDRESS})).to.be.deep.eq([]);
  });
});
