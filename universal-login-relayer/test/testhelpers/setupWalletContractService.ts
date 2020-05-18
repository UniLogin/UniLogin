import {providers} from 'ethers';
import {BlockchainService} from '@unilogin/contracts';
import {Beta2Service} from '../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../src/integration/ethereum/GnosisSafeService';
import {WalletContractService} from '../../src/integration/ethereum/WalletContractService';
import {TransactionGasPriceComputator} from '../../src/integration/ethereum/TransactionGasPriceComputator';
import {gasPriceOracleMock} from '@unilogin/commons/testutils';

export const setupWalletContractService = (provider: providers.Provider) => {
  const blockchainService = new BlockchainService(provider);
  const transactionGasPriceComputator = new TransactionGasPriceComputator(gasPriceOracleMock);
  const beta2Service = new Beta2Service(provider, transactionGasPriceComputator);
  const gnosisSafeService = new GnosisSafeService(provider, transactionGasPriceComputator);
  return new WalletContractService(blockchainService, beta2Service, gnosisSafeService);
};
