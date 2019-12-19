import {createMockProvider} from 'ethereum-waffle';
import {WalletContractService} from '../../../../src/integration/ethereum/WalletContractService';

describe('INT: WalletContractService', () => {
  const provider = createMockProvider();
  const walletContractService = new WalletContractService(provider);
});
