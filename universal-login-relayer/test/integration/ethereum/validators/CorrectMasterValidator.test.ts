import {ContractWhiteList, IMessageValidator, ProviderService, MessageWithFrom, TEST_ACCOUNT_ADDRESS} from '@unilogin/commons';
import {expect} from 'chai';
import {loadFixture, MockProvider} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import {getContractWhiteList} from '../../../../src/http/relayers/RelayerUnderTest';
import CorrectMasterValidator from '../../../../src/integration/ethereum/validators/CorrectMasterValidator';
import {getTestSignedMessage} from '../../../testconfig/message';
import {basicWalletContractWithMockToken} from '../../../fixtures/basicWalletContractWithMockToken';
import {WalletContractService} from '../../../../src/integration/ethereum/WalletContractService';
import {setupWalletContractService} from '../../../testhelpers/setupWalletContractService';

describe('INT: CorrectMasterValidator', () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let master: Contract;
  let provider: MockProvider;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();
  let walletContractService: WalletContractService;

  before(async () => {
    ({mockToken, provider, master, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    walletContractService = setupWalletContractService(provider);
    validator = new CorrectMasterValidator(new ProviderService(provider), contractWhiteList, walletContractService);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when invalid proxy but valid master', async () => {
    const validatorWithInvalidProxy = new CorrectMasterValidator(new ProviderService(provider), {
      wallet: contractWhiteList.wallet,
      proxy: [TEST_ACCOUNT_ADDRESS],
    },
    walletContractService,
    );
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidProxy.validate(signedMessage)).to.not.be.rejected;
  });

  it('throws when invalid master', async () => {
    const validatorWithInvalidMaster = new CorrectMasterValidator(new ProviderService(provider), {
      wallet: [TEST_ACCOUNT_ADDRESS],
      proxy: contractWhiteList.proxy,
    },
    walletContractService,
    );
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidMaster.validate(signedMessage)).to.be.eventually
      .rejectedWith(`Invalid master at address '${master.address}'. Deployed contract bytecode hash: '${contractWhiteList.wallet[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });
});
