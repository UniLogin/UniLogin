import chai, {expect} from 'chai';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {setupSdk} from '@universal-login/sdk/testutils';

chai.use(solidity);

describe('INT: WalletService', async () => {
  let walletService: WalletService;
  let sdk: UniversalLoginSDK;
  let relayer: Relayer;

  before(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({sdk, relayer} = await setupSdk(wallet));
    walletService = new WalletService(sdk);
  });

  it('create wallet', async () => {
    expect(walletService.state).to.be.eq('None');
    const futureWallet = await walletService.createFutureWallet();
    expect(futureWallet.contractAddress).to.be.properAddress;
    expect(futureWallet.privateKey).to.be.properPrivateKey;
    expect(futureWallet.deploy).to.be.a('function');
    expect(futureWallet.waitForBalance).to.be.a('function');
    expect(futureWallet).to.deep.eq(walletService.getDeployedWallet().asApplicationWallet);
    expect(walletService.state).to.be.eq('Future');
  });

  after(async () => {
    await relayer.stop();
  });
});
