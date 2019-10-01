import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture, deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {MessageWithFrom, TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {createSignedMessage, createSignedMessageFromUnsigned} from '@universal-login/contracts';
import basicWalletContractWithMockToken from '../../../../fixtures/basicWalletContractWithMockToken';
import EnoughTokenValidator, {hasEnoughToken} from '../../../../../lib/integration/ethereum/validators/EnoughTokenValidator';
import IMessageValidator from '../../../../../lib/core/services/validators/IMessageValidator';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';

describe('INT: EnoughTokenValidator', async () => {
  let message: MessageWithFrom;
  let mockToken: Contract;
  let walletContract: Contract;
  let wallet: Wallet;
  let validator: IMessageValidator;

  before(async () => {
    ({mockToken, wallet, walletContract} = await loadFixture(basicWalletContractWithMockToken));
    message = {from: walletContract.address, gasToken: mockToken.address, to: TEST_ACCOUNT_ADDRESS};
    validator = new EnoughTokenValidator(wallet);
  });

  it('successfully pass the validation', async () => {
    const signedMessage = createSignedMessage({...message}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.not.be.rejected;
  });

  it('passes when not enough gas', async () => {
    const signedMessage = createSignedMessageFromUnsigned({...message, gasLimitExecution: 100, gasData: 1000}, wallet.privateKey);
    await expect(validator.validate(signedMessage)).to.be.eventually.fulfilled;
  });

  it('throws when not enough tokens', async () => {
    const signedMessage = createSignedMessage({...message, gasLimit: utils.parseEther('2.0')}, wallet.privateKey);
    await expect(validator.validate(signedMessage))
      .to.be.eventually.rejectedWith('Not enough tokens');
  });

  describe('hasEnoughToken', async () => {
    let provider : providers.Provider;
    let wallet : Wallet;
    let otherWallet : Wallet;
    const gasLimit = 1000000;
    let token : Contract;
    let walletContract : Contract;

    before(async () => {
      provider = createMockProvider();
      [wallet, otherWallet] = await getWallets(provider);
      token = await deployContract(wallet, MockToken, []);
      walletContract = await deployContract(wallet, WalletContract, []);
      await walletContract.initialize(wallet.address);
      await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('1.0')});
      await token.transfer(walletContract.address, utils.parseEther('1'));
    });

    it('Should return true if contract has enough token', async () => {
      expect(await hasEnoughToken(token.address, walletContract.address, gasLimit, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, gasLimit * 2, provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('0.09'), provider)).to.be.true;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('0.9'), provider)).to.be.true;
    });

    it('Should return false if contract has not enough token', async () => {
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('1.00001'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('1.1'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('2'), provider)).to.be.false;
      expect(await hasEnoughToken(token.address, walletContract.address, utils.parseEther('10'), provider)).to.be.false;
    });

    it('Should return true if contract has enough ethers', async () => {
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, gasLimit, provider)).to.be.true;
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('1.0'), provider)).to.be.true;
    });

    it('Should return false if contract has not enough ethers', async () => {
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('1.01'), provider)).to.be.false;
      expect(await hasEnoughToken(ETHER_NATIVE_TOKEN.address, walletContract.address, utils.parseEther('2.0'), provider)).to.be.false;
    });

    it('Should throw error, when passed address is not a token address', async () => {
      expect(hasEnoughToken(otherWallet.address, walletContract.address, utils.parseEther('2'), provider)).to.be.eventually.rejectedWith(Error);
    });
  });
});
