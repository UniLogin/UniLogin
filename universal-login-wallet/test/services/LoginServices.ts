import {expect} from 'chai';
import CreationSerivice from '../../src/services/Creation';
import ConnectionToWalletService from '../../src/services/ConnectToWallet';
import WalletService from '../../src/services/WalletService';
import {setupSdk} from 'universal-login-sdk/test';


describe('LogiServices', () => {
  let creationService: any;
  let connectToWalletService: any;
  let walletService: any;
  let sdk;
  let relayer: any;

  before(async () => {
    ({sdk, relayer} = await setupSdk({overridePort: 33113}));
    walletService = new WalletService();
    creationService = CreationSerivice(sdk, walletService);
    connectToWalletService = ConnectionToWalletService(sdk, walletService);
  });

  it('should create contract wallet', async () => {
    const name = 'name.mylogin.eth';
    const [privateKey, contractAddress] = await creationService(name);
    expect(privateKey).to.not.be.null;
    expect(contractAddress).to.not.be.null;

    const userWallet = walletService.userWallet;
    expect(userWallet.name).to.eq(name);
    expect(userWallet.privateKey).to.eq(privateKey);
    expect(userWallet.contractAddress).to.eq(contractAddress);
  });

  it('should send connection request to relayer', async () => {
    const name = 'name.mylogin.eth';
    const privateKey = await connectToWalletService(name);
    expect(privateKey).to.not.be.null;
  });

  after(async () => {
    await relayer.stop();
  });
});
