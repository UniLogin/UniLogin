import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {loadFixture, deployContract} from 'ethereum-waffle';
import {messageToSignedMessage} from '@universal-login/contracts';
import {createSignedMessage, MessageWithFrom, TEST_ACCOUNT_ADDRESS, ContractWhiteList} from '@universal-login/commons';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';
import MessageExecutionValidator from '../../../../../lib/integration/ethereum/validators/MessageExecutionValidator';
import {getContractWhiteList} from '../../../../../lib/http/relayers/RelayerUnderTest';
import {transferMessage} from '../../../../fixtures/basicWalletContract';

// @ts-ignore
import MockToken from '@universal-login/contracts/build/MockToken';

describe('INT: MessageExecutionValidator', async () => {
  let message: MessageWithFrom;
  let master: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let messageExecutionValidator: IMessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();

  before(async () => {
    ({wallet, master, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {...transferMessage, from: walletContract.address, to: TEST_ACCOUNT_ADDRESS};
    messageExecutionValidator = new MessageExecutionValidator(wallet, contractWhiteList);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(messageExecutionValidator.validate(signedMessage)).to.not.be.rejected;
  });

  it('throws when not enough gas', async () => {
    const signedMessage = createSignedMessage({...message, gasLimitExecution: 100}, wallet.privateKey);
    await expect(messageExecutionValidator.validate(signedMessage)).to.be.eventually.rejectedWith('Not enough gas');
  });

  it('throws when not enough tokens', async () => {
    const mockToken = await deployContract(wallet, MockToken);
    await mockToken.transfer(walletContract.address, 1);

    const signedMessage = messageToSignedMessage({...message, gasToken: mockToken.address}, wallet.privateKey);
    await expect(messageExecutionValidator.validate(signedMessage))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });

  it('throws when invalid proxy', async () => {
    const messageValidatorWithInvalidProxy = new MessageExecutionValidator(wallet, {
      wallet: contractWhiteList.wallet,
      proxy: [TEST_ACCOUNT_ADDRESS]
    });
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(messageValidatorWithInvalidProxy.validate(signedMessage)).to.be.eventually.rejectedWith(`Invalid proxy at address '${signedMessage.from}'. Deployed contract bytecode hash: '${contractWhiteList.proxy[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });

  it('throws when invalid master', async () => {
    const messageValidatorWithInvalidMaster = new MessageExecutionValidator(wallet, {
      wallet: [TEST_ACCOUNT_ADDRESS],
      proxy: contractWhiteList.proxy
    });
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(messageValidatorWithInvalidMaster.validate(signedMessage)).to.be.eventually
    .rejectedWith(`Invalid master at address '${master.address}'. Deployed contract bytecode hash: '${contractWhiteList.wallet[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });
});
