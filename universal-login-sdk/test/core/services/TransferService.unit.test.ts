import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, SEND_TRANSACTION_GAS_LIMIT} from '@unilogin/commons';
import {TransferService} from '../../../src/core/services/TransferService';
import {encodeERC20Transfer} from '../../../src/core/utils/encodeTransferToMessage';

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
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    });

    expect(deployedWallet.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: TEST_ACCOUNT_ADDRESS,
        value: utils.parseEther('123'),
        data: '0x',
        gasLimit: SEND_TRANSACTION_GAS_LIMIT,
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
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    })).to.be.rejectedWith('Wallet not found');
  });

  it('can transfer tokens', async () => {
    const {deployedWallet, transferService} = setup();
    const recipient = Wallet.createRandom().address;
    await transferService.transfer({
      to: recipient,
      amount: '123',
      token: {
        address: 'TOKEN_ADDRESS',
        decimals: 18,
      },
      gasParameters,
    });

    expect(deployedWallet.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: 'TOKEN_ADDRESS',
        value: 0,
        data: encodeERC20Transfer(recipient, '123', 18),
        gasLimit: SEND_TRANSACTION_GAS_LIMIT,
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
      token: {
        address: 'TOKEN_ADDRESS',
        decimals: 18,
      },
      gasParameters,
    })).to.be.rejectedWith('Wallet not found');
  });

  it('throw an error if not enough tokens', async () => {
    const {transferService, deployedWallet} = setup();
    deployedWallet.execute = () => {throw new Error('Not enough tokens');};
    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    })).to.be.rejectedWith('Not enough tokens');
  });

  it('return an error if amount is not valid', async () => {
    const {transferService, balance} = setup();
    expect(await transferService.validateInputs({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '350',
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    }, balance))
      .to.deep.eq({amount: ['Insufficient funds. Sending 350.0 eth, got only 300.0 eth'], to: []});
  });

  it('return an error if address is not valid', async () => {
    const {transferService, balance} = setup();
    expect(await transferService.validateInputs({
      to: '0x',
      amount: '123',
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    }, balance))
      .to.deep.eq({to: ['0x is not a valid address'], amount: []});
  });

  it('return an error if ENS name is not valid', async () => {
    const {transferService, balance} = setup();
    expect(await transferService.validateInputs({
      to: 'test',
      amount: '123',
      token: {
        address: ETHER_NATIVE_TOKEN.address,
        decimals: ETHER_NATIVE_TOKEN.decimals,
      },
      gasParameters,
    }, balance))
      .to.deep.eq({to: ['test is not a valid address or ENS name'], amount: []});
  });

  it('get Ethereum max amount', () => {
    const {transferService, balance} = setup();
    expect(transferService.getMaxAmount(gasParameters, balance)).to.eq('299.9999999999998');
  });

  it('get 0 if Ethereum max amount is below 0', () => {
    const {transferService} = setup();
    expect(transferService.getMaxAmount(gasParameters, '0')).to.eq('0.0');
  });

  it('throw error if balance is null', () => {
    const {transferService} = setup();
    expect(() => transferService.getMaxAmount(gasParameters, null)).to.throw('Balance is null');
  });
});
