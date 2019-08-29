import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/Wallet.json';
import {getDeployedBytecode, ContractJSON, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {BlockchainService} from '../../../lib/integration/ethereum/BlockchainService';
import {deployWalletMaster} from '@universal-login/contracts';

describe('INT: BlockchainService', async () => {
  const provider = createMockProvider();
  const [deployer] = getWallets(provider);
  const expectedBytecode = `0x${getDeployedBytecode(WalletMaster as ContractJSON)}`;
  const blockchainService = new BlockchainService(provider);

  it('getCode returns 0x if contract does not existing', async () => {
    const bytecode = await blockchainService.getCode(TEST_ACCOUNT_ADDRESS);
    expect(bytecode).to.be.eq('0x');
  });

  it('getCode returns bytecode of existing contract', async () => {
    const {address} = await deployWalletMaster(deployer);
    expect(await blockchainService.getCode(address)).to.be.eq(expectedBytecode);
  });

  it('getBlockNumber should return increased block number', async () => {
    const blockNumber = await blockchainService.getBlockNumber();
    expect(blockNumber).at.least(0);
    await deployWalletMaster(deployer);
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
        [ '0x7d958a859734aa5212d2568f8700fe77619bc93d5b08abf1445585bac8bff606',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000001' ],
      logIndex: 0 };
    const {address} = await deployWalletMaster(deployer);
    const logs = await blockchainService.getLogs({address});
    expect(logs).to.have.length(1);
    expect(logs[0]).to.deep.include(expectedPartOfLog);
  });

  it('should return empty array if does not match the logs', async () => {
    expect(await blockchainService.getLogs({address: TEST_ACCOUNT_ADDRESS})).to.be.deep.eq([]);
  });
});
