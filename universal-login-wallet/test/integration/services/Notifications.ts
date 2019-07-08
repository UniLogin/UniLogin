import sinon from 'sinon';
import {expect} from 'chai';
import {providers, utils, Wallet} from 'ethers';
import {Services} from '../../../src/ui/createServices';
import {setupSdk} from '../helpers/setupSdk';
import {waitUntil, ETHER_NATIVE_TOKEN, Notification} from '@universal-login/commons';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {createWallet} from '../helpers/createWallet';

describe('NotificationService', () => {
  let relayer: any;
  let services : Services;
  let contractAddress: string;
  let provider : providers.Provider;
  let blockchainObserver: any;
  let wallet: Wallet;

  before(async () => {
    [wallet] = getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    const name = 'ja.mylogin.eth';
    ({contractAddress} = await createWallet(name, services.walletService, wallet));
    ({blockchainObserver} = services.sdk);
    blockchainObserver.step = 10;
    blockchainObserver.lastBlock = 0;
    services.sdk.start();
  });

  it('should call callback when new device connecting', async () => {
    let notification: Notification;
    const callback = sinon.spy((authorisations: Notification[]) => { notification = authorisations[0]; });
    const unsubscribe = services.notificationService.subscribe(callback);

    expect(callback).has.been.calledOnceWithExactly([]);

    const privateKey = wallet.privateKey;
    const address = utils.computeAddress(privateKey).toLowerCase();

    services.sdk.connect = async (walletContractAddress: string) => {
      await services.sdk.relayerApi.connect(walletContractAddress, address.toLowerCase());
      return address;
    };
    await services.sdk.connect(contractAddress);
    await waitUntil(() => callback.secondCall !== null);

    expect(notification!).to.deep.include({
      walletContractAddress: services.walletService.userWallet!.contractAddress.toLowerCase(),
      key: address,
    });

    await services.notificationService.reject(notification!.key);
    await waitUntil(() => callback.thirdCall !== null);

    expect(callback.thirdCall).calledWithExactly([]);

    unsubscribe();
  });

  after(async () => {
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
