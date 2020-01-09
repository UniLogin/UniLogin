import {providers} from 'ethers';
import {BlockchainService} from '@universal-login/contracts';
import {Beta2Service} from '../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../src/integration/ethereum/GnosisSafeService';
import {WalletContractService} from '../../src/integration/ethereum/WalletContractService';

export const setupWalletContractService = (provider: providers.Provider) => {
  const blockchainService = new BlockchainService(provider);
  const beta2Service = new Beta2Service(provider);
  const gnosisSafeService = new GnosisSafeService(provider);
  return new WalletContractService(blockchainService, beta2Service, gnosisSafeService);
};
