import {expect} from 'chai';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {getDeployedBytecode, ContractJSON, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {BlockchainService} from '../../lib/services/BlockchainService';

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
    const {address} = await deployContract(deployer, WalletMaster);
    expect(await blockchainService.getCode(address)).to.be.eq(expectedBytecode);
  });

  it('getBlockNumber should return block number', async () => {
    const blockNumber = await blockchainService.getBlockNumber();
    expect(blockNumber).at.least(0);
    await deployContract(deployer, WalletMaster);
    const blockNumber2 = await blockchainService.getBlockNumber();
    expect(blockNumber2).greaterThan(blockNumber);
    expect(blockNumber2).to.be.eq(blockNumber + 1);
  });
});
