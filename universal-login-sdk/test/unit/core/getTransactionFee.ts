import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getTransactionFee} from '../../../lib';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('UNIT: getTransactionFee', () => {
  function setup() {
    const sdk = {
      tokensDetailsStore: {
        getTokenAddress: sinon.fake(() => '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff')
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
        privateKey: '29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F989',
        contractAddress: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
      } as any
    };
    return {sdk, walletService};
  }

  it('calculate transaction fee for ethers', async () => {
    const {sdk, walletService} = setup();
    const transferDetails = {
      amount: '200',
      currency: ETHER_NATIVE_TOKEN.symbol,
      to: ''
    };
    expect(await getTransactionFee(sdk, walletService.applicationWallet, transferDetails)).to.eq(utils.parseEther('20'));
  });

  it('calculate transaction fee for token', async () => {
    const {sdk, walletService} = setup();
    const transferDetails = {
      amount: '200',
      currency: 'TOKEN_SYMBOL',
      to: ''
    };
    await getTransactionFee(sdk, walletService.applicationWallet, transferDetails);
    expect(await getTransactionFee(sdk, walletService.applicationWallet, transferDetails)).to.eq(utils.parseEther('20'));
  });
});
