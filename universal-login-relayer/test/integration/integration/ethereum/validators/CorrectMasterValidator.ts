import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ContractWhiteList, MessageWithFrom} from '@universal-login/commons';
import {createSignedMessage} from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import CorrectMasterValidator from '../../../../../lib/integration/ethereum/validators/CorrectMasterValidator';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';
import {getContractWhiteList} from '../../../../../lib/http/relayers/RelayerUnderTest';

describe('INT: CorrectMasterValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let master: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;
  const contractWhiteList: ContractWhiteList = getContractWhiteList();

  before(async () => {
    ({mockToken, master, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new CorrectMasterValidator(wallet.provider, contractWhiteList);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when invalid proxy but valid master', async () => {
    const validatorWithInvalidProxy = new CorrectMasterValidator(wallet.provider, {
      wallet: contractWhiteList.wallet,
      proxy: [TEST_ACCOUNT_ADDRESS]
    });
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidProxy.validate(signedMessage)).to.not.be.rejected;
  });

  it('throws when invalid master', async () => {
    const validatorWithInvalidMaster = new CorrectMasterValidator(wallet.provider, {
      wallet: [TEST_ACCOUNT_ADDRESS],
      proxy: contractWhiteList.proxy
    });
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validatorWithInvalidMaster.validate(signedMessage)).to.be.eventually
      .rejectedWith(`Invalid master at address '${master.address}'. Deployed contract bytecode hash: '${contractWhiteList.wallet[0]}'. Supported bytecode hashes: [${TEST_ACCOUNT_ADDRESS}]`);
  });
});
