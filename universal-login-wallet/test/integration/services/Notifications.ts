import sinon from 'sinon';
import {expect} from 'chai';
import {providers} from 'ethers';
import {Services} from '../../../src/services/Services';
import {setupSdk} from '@universal-login/sdk/test';
import {waitUntil, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import ServicesUnderTest from '../helpers/ServicesUnderTests';

describe('NotificationService', () => {
  let relayer: any;
  let services : Services;
  let contractAddress: string;
  let privateKey: string;
  let provider : providers.Provider;
  let blockchainObserver: any;

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: '33113'}));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    const name = 'ja.mylogin.eth';
    [privateKey, contractAddress] = await services.createWallet(name);
    ({blockchainObserver} = services.sdk);
    blockchainObserver.step = 10;
    blockchainObserver.lastBlock = 0;
    services.sdk.start();
  });

  it('should call callback when new device connecting', async () => {
    let notification: any = {key: null};
    const callback = sinon.spy((authorisations: any) => { notification = authorisations[0]; });
    const unsubscribe = services.notificationService.subscribe(callback);

    expect(callback).has.been.calledOnce;

    await services.sdk.connect(contractAddress);
    await waitUntil(() => callback.secondCall !== null);

    expect(callback).has.been.calledTwice;
    expect(notification).to.not.be.null;

    expect(notification.key).to.not.be.null;

    await services.notificationService.reject(notification.key);
    await waitUntil(() => callback.thirdCall !== null);

    expect(notification).to.be.undefined;
    expect(callback).has.been.calledThrice;
    unsubscribe();
  });

  after(async () => {
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
