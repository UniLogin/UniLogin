import {ContractWhiteList, IMessageValidator, ProviderService, MessageWithFrom, TEST_ACCOUNT_ADDRESS} from '@unilogin/commons';
import {expect} from 'chai';
import {loadFixture, MockProvider} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import {getContractWhiteList} from '../../../../src/http/relayers/RelayerUnderTest';
import CorrectProxyValidator from '../../../../src/integration/ethereum/validators/CorrectProxyValidator';
import {getTestSignedMessage} from '../../../testconfig/message';
import {basicWalletContractWithMockToken} from '../../../fixtures/basicWalletContractWithMockToken';

describe('INT: CorrectProxyValidator', () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let provider: MockProvider;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();

  before(async () => {
    ({mockToken, provider, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new CorrectProxyValidator(new ProviderService(provider), contractWhiteList);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when invalid master but valid proxy', async () => {
    const validatorWithInvalidMaster = new CorrectProxyValidator(new ProviderService(provider), {
      wallet: [TEST_ACCOUNT_ADDRESS],
      proxy: contractWhiteList.proxy,
    });
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidMaster.validate(signedMessage)).to.be.eventually.fulfilled;
  });

  it('throws when invalid proxy', async () => {
    const messageValidatorWithInvalidProxy = new CorrectProxyValidator(new ProviderService(provider), {
      wallet: contractWhiteList.wallet,
      proxy: [TEST_ACCOUNT_ADDRESS],
    });
    const signedMessage = getTestSignedMessage({...message}, wallet.privateKey);
    await expect(messageValidatorWithInvalidProxy.validate(signedMessage)).to.be.eventually.rejectedWith(`Invalid proxy at address '${signedMessage.from}'. Deployed contract bytecode hash: '${contractWhiteList.proxy[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });
});
