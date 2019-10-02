import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ContractWhiteList, MessageWithFrom} from '@universal-login/commons';
import {messageToSignedMessage, emptyMessage} from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import CorrectProxyValidator from '../../../../../lib/integration/ethereum/validators/CorrectProxyValidator';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';
import {getContractWhiteList} from '../../../../../lib/http/relayers/RelayerUnderTest';

describe('INT: CorrectProxyValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {...emptyMessage, from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new CorrectProxyValidator(wallet.provider, contractWhiteList);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = messageToSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when invalid master but valid proxy', async () => {
    const validatorWithInvalidMaster = new CorrectProxyValidator(wallet.provider, {
      wallet: [TEST_ACCOUNT_ADDRESS],
      proxy: contractWhiteList.proxy
    });
    const signedMessage = messageToSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidMaster.validate(signedMessage)).to.be.eventually.fulfilled;
  });

  it('throws when invalid proxy', async () => {
    const messageValidatorWithInvalidProxy = new CorrectProxyValidator(wallet.provider, {
      wallet: contractWhiteList.wallet,
      proxy: [TEST_ACCOUNT_ADDRESS]
    });
    const signedMessage = messageToSignedMessage({...message}, wallet.privateKey);
    await expect(messageValidatorWithInvalidProxy.validate(signedMessage)).to.be.eventually.rejectedWith(`Invalid proxy at address '${signedMessage.from}'. Deployed contract bytecode hash: '${contractWhiteList.proxy[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });
});
