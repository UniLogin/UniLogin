import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, calculateMessageHash} from '@universal-login/commons';
import {ContractService} from '../../../src/integration/ethereum/ContractService';
import {BlockchainService} from '@universal-login/contracts';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {Contract, Wallet} from 'ethers';
import createWalletContract from '../../testhelpers/createWalletContract';
import {getTestSignedMessage} from '../../testconfig/message';

describe('ContractService', () => {
  let contractService: ContractService;
  let proxyContract: Contract;
  let wallet: Wallet;

  before(async () => {
    const provider = createMockProvider();
    const blockchainService = new BlockchainService(provider);
    const walletContractService = new WalletContractService(provider);
    contractService = new ContractService(blockchainService, walletContractService);
    [wallet] = getWallets(provider);
    ({proxy: proxyContract} = await createWalletContract(wallet));
  });

  describe('beta2', () => {
    it('returns false if key doesn`t exists', async () => {
      expect(await contractService.keyExist(proxyContract.address, TEST_ACCOUNT_ADDRESS)).to.be.false;
    });

    it('returns true if key exists', async () => {
      expect(await contractService.keyExist(proxyContract.address, wallet.address)).to.be.true;
    });

    it('calculates message hash', async () => {
      const message = {...getTestSignedMessage(), from: proxyContract.address};
      const testSignedMsgHash = '0x05a728fe92e4d942a172d5268f7fb765c29ed4c0771962bd32cc11e31a45e2ba';
      expect(await contractService.calculateMessageHash(message)).to.eq(testSignedMsgHash)
    });

    it('recovers signer from message', async () => {
      const signedMessage = {

      };

    });
  });
});
