import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {TransferService, encodeTransfer} from '../../../lib/core/services/TransferService';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('UNIT: TransferService', () => {
  function setup() {
    const tokenService = {
      getTokenAddress: sinon.fake(() => 'TOKEN_ADDRESS')
    };
    const sdk = {
      execute: sinon.stub().returns({}),
      tokensDetailsStore: tokenService
    } as any;
    const walletService = {
      deployedWallet: {
        privateKey: 'PRIVATE_KEY',
        contractAddress: 'CONTRACT_ADDRESS',
        sdk
      } as any
    };
    const transferService = new TransferService(walletService.deployedWallet as any);
    return {sdk, walletService, tokenService, transferService};
  }

  it('can transfer ether', async () => {
    const {sdk, transferService, tokenService} = setup();

    await transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: ETHER_NATIVE_TOKEN.symbol
    });

    expect(tokenService.getTokenAddress).to.not.be.called;
    expect(sdk.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: TEST_ACCOUNT_ADDRESS,
        value: utils.parseEther('123'),
        data: '0x',
        gasToken: ETHER_NATIVE_TOKEN.address
      },
      'PRIVATE_KEY',
    );
  });

  it('throw an error if wallet missing and transferring ETH', async () => {
    const {tokenService} = setup();
    const transferService = new TransferService(undefined as any);

    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: ETHER_NATIVE_TOKEN.symbol
    })).to.be.rejectedWith('Wallet not found');

    expect(tokenService.getTokenAddress).to.not.be.called;
  });

  it('can transfer tokens', async () => {
    const {sdk, transferService, tokenService} = setup();
    const recipient = Wallet.createRandom().address;

    await transferService.transfer({
      to: recipient,
      amount: '123',
      currency: 'TOKEN_SYMBOL'
    });

    expect(tokenService.getTokenAddress).to.be.calledWith('TOKEN_SYMBOL');
    expect(sdk.execute).to.be.calledWith(
      {
        from: 'CONTRACT_ADDRESS',
        to: 'TOKEN_ADDRESS',
        value: 0,
        data: encodeTransfer(recipient, '123'),
        gasToken: 'TOKEN_ADDRESS'
      },
      'PRIVATE_KEY',
    );
  });

  it('throw an error if wallet is missing and transfering tokens', async () => {
    const {tokenService, walletService} = setup();
    walletService.deployedWallet = undefined;

    const transferService = new TransferService(undefined as any);

    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: 'TOKEN_SYMBOL'
    })).to.be.rejectedWith('Wallet not found');

    expect(tokenService.getTokenAddress).to.not.be.called;
  });

  it('throw an error if not enough tokens', async () => {
    const {transferService, sdk} = setup();
    sdk.execute = () => { throw new Error('Not enough tokens'); };
    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: ETHER_NATIVE_TOKEN.symbol
    })).to.be.rejectedWith('Not enough tokens');
  });

  it('throw an error if address is not valid', async () => {
    const {transferService} = setup();
    await expect(transferService.transfer({
      to: '0x',
      amount: '123',
      currency: ETHER_NATIVE_TOKEN.symbol
    })).to.be.rejectedWith(`Address 0x is not valid`);
  });
});
