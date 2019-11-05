import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture, deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, Message, TEST_GAS_PRICE} from '@universal-login/commons';
import {messageToSignedMessage, unsignedMessageToSignedMessage, emptyMessage} from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import EnoughTokenValidator, {hasEnoughToken} from '../../../../../lib/integration/ethereum/validators/EnoughTokenValidator';
import IMessageValidator from '../../../../../lib/core/models/IMessageValidator';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';

describe('INT: EnoughTokenValidator', async () => {
  let message: Message;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {...emptyMessage, from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new EnoughTokenValidator(wallet);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = messageToSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when not enough gas', async () => {
    const signedMessage = unsignedMessageToSignedMessage({...message, gasLimitExecution: 100, gasData: 1000}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.fulfilled;
  });

  it('throws when not enough tokens', async () => {
    const signedMessage = messageToSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });

  describe('hasEnoughToken', async () => {
    let provider: providers.Provider;
    let wallet: Wallet;
    let otherWallet: Wallet;
    const gasLimit = 1000000;
    const gasPrice = '2';
    let token: Contract;
    let walletContract: Contract;

    before(async () => {
      provider = createMockProvider();
      [wallet, otherWallet] = await getWallets(provider);
      token = await deployContract(wallet, MockToken, []);
      walletContract = await deployContract(wallet, WalletContract, []);
      await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
      await walletContract.initialize(wallet.address, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
      await token.transfer(walletContract.address, utils.parseEther('1'));
    });

    const createPaymentOptions = (gasToken: string, gasLimit: utils.BigNumberish, gasPrice: utils.BigNumberish) => ({gasToken, gasLimit, gasPrice});

    it('Should return true if contract has enough token', async () => {
      expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit, gasPrice), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, gasLimit * 2, gasPrice), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.09'), '10'), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, '10', utils.parseEther('0.09')), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('0.9'), '1'), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(token.address, '1', utils.parseEther('0.9')), walletContract.address, provider)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.00001'), gasPrice), walletContract.address, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('1.1'), gasPrice,), walletContract.address, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('2'), gasPrice,), walletContract.address, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(token.address, utils.parseEther('10'), gasPrice,), walletContract.address, provider)).to.be.false;
    });

    it('Should return true if contract has enough ethers', async () => {
      const walletBalance = await provider.getBalance(walletContract.address);
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, gasLimit, gasPrice), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance.div(gasPrice), gasPrice), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, walletBalance, '1'), walletContract.address, provider)).to.be.true;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, '1', walletBalance), walletContract.address, provider)).to.be.true;
    });

    it('Should return false if contract has not enough ethers', async () => {
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('1.01'), gasPrice), walletContract.address, provider)).to.be.false;
      expect(await hasEnoughToken(createPaymentOptions(ETHER_NATIVE_TOKEN.address, utils.parseEther('2.0'), gasPrice), walletContract.address, provider)).to.be.false;
    });

    it('Should throw error, when passed address is not a token address', async () => {
      expect(hasEnoughToken(createPaymentOptions(otherWallet.address, utils.parseEther('2'), gasPrice), walletContract.address, provider)).to.be.eventually.rejectedWith(Error);
    });
  });
});
