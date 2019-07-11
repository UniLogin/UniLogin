import sinon from 'sinon';
import {expect} from 'chai';
import {providers, Wallet} from 'ethers';
import {Services} from '../../../src/ui/createServices';
import {setupSdk} from '../helpers/setupSdk';
import {waitUntil, ETHER_NATIVE_TOKEN, Notification, KeyPair, createKeyPair} from '@universal-login/commons';
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
  let keyPair: KeyPair;

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
    keyPair = createKeyPair();
    services.sdk.connect = async (walletContractAddress: string) => {
      await services.sdk.relayerApi.connect(walletContractAddress, keyPair.publicKey.toLowerCase());
      return keyPair.publicKey.toLowerCase();
    };
  });

  it('should call callback when new device connecting', async () => {
    let notification: Notification;
    const callback = sinon.spy((authorisations: Notification[]) => { notification = authorisations[0]; });
    const unsubscribe = services.notificationService.subscribe(callback);

    expect(callback).has.been.calledOnceWithExactly([]);
    
    const publicKey = await services.sdk.connect(contractAddress);
    await waitUntil(() => callback.secondCall !== null);

    expect(notification!).to.deep.include({
      walletContractAddress: services.walletService.userWallet!.contractAddress.toLowerCase(),
      key: publicKey,
    });

    await services.notificationService.reject(notification!.key);
    await waitUntil(() => callback.thirdCall !== null);

    expect(callback.thirdCall).calledWithExactly([]);

    unsubscribe();
  });

  it('should call all callbacks', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = services.notificationService.subscribe(callback1);
    const unsubscribe2 = services.notificationService.subscribe(callback2);
    await services.sdk.connect(contractAddress);
    
    await waitUntil(() => !!callback1.firstCall);
    expect(callback1).to.have.been.called;
    expect(callback2).to.have.been.called;
    unsubscribe1();
    unsubscribe2();
  });

  after(async () => {
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
