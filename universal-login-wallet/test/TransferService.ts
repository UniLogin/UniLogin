import {TransferService} from '../src/services/TransferService';
import {expect} from 'chai';
import setupSdk from './SetupSdk';
import UniversalLoginSDK from 'universal-login-sdk';


describe('TransferService', () => {
  let transferService: TransferService;
  let provider: any;
  let relayer: any;
  let sdk: UniversalLoginSDK;

  before(async () => {
    ({sdk, relayer, provider} = await setupSdk());
    transferService = new TransferService(sdk);
  });

  it('Should transfer funds', async () => {
    const to = '0x0000000000000000000000000000000000000001';
    const amount = 1;
    const currency = 'DAI';
    const expectedBalance = (await provider.getBalance(to)).add(amount);
    await transferService.transfer(to, amount, currency);
    expect(await provider.getBalance(to)).to.eq(expectedBalance);
  });

  after(async () => {
    await relayer.stop();
  })
});
