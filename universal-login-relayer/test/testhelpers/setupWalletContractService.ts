import {providers} from 'ethers';
import {ContractService} from '@unilogin/contracts';
import {ProviderService} from '@unilogin/commons';
import {Beta2Service} from '../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../src/integration/ethereum/GnosisSafeService';
import {WalletContractService} from '../../src/integration/ethereum/WalletContractService';
import {TransactionGasPriceComputator} from '../../src/integration/ethereum/TransactionGasPriceComputator';
import {getMockedGasPriceOracle} from '@unilogin/commons/testutils';

export const setupWalletContractService = (provider: providers.JsonRpcProvider) => {
  const providerService = new ProviderService(provider);
  const contractService = new ContractService(providerService);
  const transactionGasPriceComputator = new TransactionGasPriceComputator(getMockedGasPriceOracle());
  const beta2Service = new Beta2Service(provider, transactionGasPriceComputator);
  const gnosisSafeService = new GnosisSafeService(provider, transactionGasPriceComputator);
  return new WalletContractService(contractService, beta2Service, gnosisSafeService);
};
