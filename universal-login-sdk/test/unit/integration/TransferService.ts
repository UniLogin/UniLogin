import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {TransferService, encodeTransfer} from '../../../lib/integration/ethereum/TransferService';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('UNIT: TransferService', () => {
  function setup() {
    const tokenService = {
      getTokenAddress: sinon.fake(() => 'TOKEN_ADDRESS')
    };
    const sdk = {
      execute: sinon.stub().returns({}),
      tokensDetailsStore: tokenService,
      balanceChecker: {
        getBalance: sinon.stub().returns(utils.parseEther('200'))
      },
      provider: {
        estimateGas: sinon.stub().returns(utils.parseEther('10'))
      },
      sdkConfig: {
        paymentOptions: {
          gasPrice: '1',
          gasLimit: '17000'
        }
      },
      getNonce: sinon.stub().returns(1)
    } as any;
    const walletService = {
      applicationWallet: {
        privateKey: 'PRIVATE_KEY',
        contractAddress: 'CONTRACT_ADDRESS',
      } as any
    };
    const transferService = new TransferService(sdk as any, walletService.applicationWallet as any);
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
    const {sdk, tokenService} = setup();
    const transferService = new TransferService(sdk as any, undefined as any);

    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: ETHER_NATIVE_TOKEN.symbol
    })).to.be.rejectedWith('Application wallet not found');

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
        data: encodeTransfer(recipient, utils.parseEther('123')),
        gasToken: 'TOKEN_ADDRESS'
      },
      'PRIVATE_KEY',
    );
  });

  it('check if transfer amount is max', async () => {
    const {transferService} = setup();
    expect(await transferService.checkIfAmountIsMax('TOKEN_ADDRESS', utils.parseEther('200'))).to.be.true;
    expect(await transferService.checkIfAmountIsMax('TOKEN_ADDRESS', utils.parseEther('123'))).to.be.false;
  });

  it('calculate new amount if amount is max', async () => {
    const {transferService, walletService} = setup();
    const recipient = Wallet.createRandom().address;
    const etherMessage = {
      from: '0x123',
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('200'),
      data: '0x',
      gasToken: ETHER_NATIVE_TOKEN.address
    };
    const tokenMessage = {
      from: '0x123',
      to: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
      value: 0,
      data: encodeTransfer(recipient, utils.parseEther('200')),
      gasToken: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff'
    };
    walletService.applicationWallet.privateKey = '29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F989';
    expect(await transferService.calculateNewAmount(etherMessage, utils.parseEther('200'))).to.eq(utils.parseEther('180'));
    expect(await transferService.calculateNewAmount(tokenMessage, utils.parseEther('200'))).to.eq(utils.parseEther('180'));
  });

  it('throw an error if wallet is missing and transfering tokens', async () => {
    const {sdk, tokenService, walletService} = setup();
    walletService.applicationWallet = undefined;

    const transferService = new TransferService(sdk as any, undefined as any);

    await expect(transferService.transfer({
      to: TEST_ACCOUNT_ADDRESS,
      amount: '123',
      currency: 'TOKEN_SYMBOL'
    })).to.be.rejectedWith('Application wallet not found');

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
