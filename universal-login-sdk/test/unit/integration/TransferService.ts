import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {TransferService} from '../../../lib/core/services/TransferService';
import {encodeERC20Transfer} from '../../../lib/core/utils/encodeTransferToMessage';

chai.use(sinonChai);
chai.use(chaiAsPromised);

const gasParameters = {
  gasPrice: utils.bigNumberify('1'),
  gasToken: ETHER_NATIVE_TOKEN.address,
};

describe('UNIT: TransferService', () => {
  function setup() {
    const deployedWallet = {
      privateKey: 'PRIVATE_KEY',
      contractAddress: 'CONTRACT_ADDRESS',
      execute: sinon.stub().returns({}),
    } as any;
    const walletService = {deployedWallet};
    const transferService = new TransferService(walletService.deployedWallet as any);
    const balance = '300';
    return {deployedWallet, walletService, transferService, balance};
  }

  it('can transfer ether', async () => {
    const {deployedWallet, transferService} = setup();

    await transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    });

    expect(deployedWallet.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: TEST_ACCOUNT_ADDRESS,
        value: utils.parseEther('123'),
        data: '0x',
        gasToken: gasParameters.gasToken,
        gasPrice: gasParameters.gasPrice,
      },
    );
  });

  it('throw an error if wallet missing and transferring ETH', async () => {
    const transferService = new TransferService(undefined as any);

    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    })).to.be.rejectedWith('Wallet not found');
  });

  it('can transfer tokens', async () => {
    const {deployedWallet, transferService} = setup();
    const recipient = Wallet.createRandom().address;
    await transferService.transfer({
      to: recipient,
      amount: '123',
      transferToken: 'TOKEN_ADDRESS',
      gasParameters,
    });

    expect(deployedWallet.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: 'TOKEN_ADDRESS',
        value: 0,
        data: encodeERC20Transfer(recipient, '123'),
        gasToken: gasParameters.gasToken,
        gasPrice: gasParameters.gasPrice,
      },
    );
  });

  it('throw an error if wallet is missing and transferring tokens', async () => {
    const {walletService} = setup();
    walletService.deployedWallet = undefined;

    const transferService = new TransferService(undefined as any);
    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      transferToken: 'TOKEN_ADDRESS',
      gasParameters,
    })).to.be.rejectedWith('Wallet not found');
  });

  it('throw an error if not enough tokens', async () => {
    const {transferService, deployedWallet} = setup();
    deployedWallet.execute = () => {throw new Error('Not enough tokens');};
    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    })).to.be.rejectedWith('Not enough tokens');
  });

  it('throw an error if address is not valid', async () => {
    const {transferService, balance} = setup();
    expect(() => transferService.validateInputs({
      to: '0x',
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    }, balance)).to.throw('0x is not valid');
  });

  it('throw an error if ens name is not valid', async () => {
    const {transferService, balance} = setup();
    expect(() => transferService.validateInputs({
      to: 'test',
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    }, balance)).to.throw('test is not valid');
  });

  it('throw an error if amount is not valid', async () => {
    const {transferService, balance} = setup();
    expect(() => transferService.validateInputs({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '350',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    }, balance)).to.throw('Amount 350 is not valid');
  });

  it('throw an error if amount and recipient is not valid', async () => {
    const {transferService, balance} = setup();
    expect(() => transferService.validateInputs({
      to: '0x',
      amount: '350',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    }, balance)).to.throw('Amount 350 and recipient 0x is not ');
  });

  it('get Ethereum max amount', () => {
    const {transferService, balance} = setup();
    expect(transferService.getEtherMaxAmount(gasParameters, balance)).to.eq('299.9999999999998');
  });

  it('get 0 if Ethereum max amount is below 0', () => {
    const {transferService} = setup();
    expect(transferService.getEtherMaxAmount(gasParameters, '0')).to.eq('0.0');
  });

  it('throw error if balance is null', () => {
    const {transferService} = setup();
    expect(() => transferService.getEtherMaxAmount(gasParameters, null)).to.throw('Balance is null');
  });
});
