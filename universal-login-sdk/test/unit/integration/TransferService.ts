import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {TransferService, encodeTransfer} from '../../../lib/core/services/TransferService';

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
    return {deployedWallet, walletService, transferService};
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
        data: encodeTransfer(recipient, '123'),
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
    const {transferService} = setup();
    await expect(transferService.transfer({
      to: '0x',
      amount: '123',
      transferToken: ETHER_NATIVE_TOKEN.address,
      gasParameters,
    })).to.be.rejectedWith('Address 0x is not valid');
  });
});
