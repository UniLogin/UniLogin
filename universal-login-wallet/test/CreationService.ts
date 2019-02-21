import {expect} from 'chai';
import CreationSerivice from '../src/services/CreationService';
import UserWalletService from '../src/services/UserWalletService';
import setupSdk from './SetupSdk';


describe('CreationService', () => {
  let creationService: any;
  let userWalletService: any;
  let sdk;
  let relayer: any;

  before(async () => {
    ({sdk, relayer} = await setupSdk());
    userWalletService = new UserWalletService();
    creationService = new CreationSerivice(sdk, userWalletService);
  });

  it('should create contract wallet and set identity', async () => {
    const name = 'name.mylogin.eth';
    const [privateKey, contractAddress] = await creationService.create(name);
    expect(privateKey).to.not.be.null;
    expect(contractAddress).to.not.be.null;

    const userWallet = userWalletService.userWallet;
    expect(userWallet.name).to.eq(name);
    expect(userWallet.privateKey).to.eq(privateKey);
    expect(userWallet.contractAddress).to.eq(contractAddress);
  });

  after(async () => {
    await relayer.stop();
  });
});
