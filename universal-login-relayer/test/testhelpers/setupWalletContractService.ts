import {providers} from 'ethers';
import {BlockchainService} from '@unilogin/contracts';
import {Beta2Service} from '../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../src/integration/ethereum/GnosisSafeService';
import {WalletContractService} from '../../src/integration/ethereum/WalletContractService';
import {TEST_GAS_PRICE} from '@unilogin/commons';
import {TransactionGasPriceComputator} from '../../src/integration/ethereum/TransactionGasPriceComputator';

export const setupWalletContractService = (provider: providers.Provider) => {
  const blockchainService = new BlockchainService(provider);
  const gasPriceOracle = {
    getGasPrices: () => ({
      fast: {gasPrice: TEST_GAS_PRICE},
    }),
  };
  const transactionGasPriceComputator = new TransactionGasPriceComputator(gasPriceOracle as any);
  const beta2Service = new Beta2Service(provider, transactionGasPriceComputator);
  const gnosisSafeService = new GnosisSafeService(provider, transactionGasPriceComputator);
  return new WalletContractService(blockchainService, beta2Service, gnosisSafeService);
};
