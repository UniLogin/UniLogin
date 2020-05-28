import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {ULWeb3Provider} from '../src/ULWeb3Provider';
import {describe} from 'mocha';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';

chai.use(chaiAsPromised);

describe('UNIT: ULWeb3Provider', () => {
  describe('Initialization', () => {
    let ulProvider: ULWeb3Provider;
    const initSpy: sinon.SinonSpy = sinon.stub().resolves();
    const stopSpy: sinon.SinonSpy = sinon.stub().resolves();

    beforeEach(() => {
      ulProvider = new ULWeb3Provider({
        network: 'ganache',
        provider: {
          send: sinon.spy(),
        },
        relayerUrl: 'http://relayer.url',
        ensDomains: ['uniweb3.eth'],
        observedTokensAddresses: [ETHER_NATIVE_TOKEN.address],
      });

      sinon.replace(ulProvider as any, '_init', initSpy);
      sinon.replace(ulProvider as any, '_finalizeAndStop', stopSpy);
    });

    it('should initialize once', async () => {
      ulProvider.init();
      await ulProvider.init();
      expect(initSpy).to.be.calledOnce;
    });

    it('should initialize twice', async () => {
      await ulProvider.init();
      await ulProvider.finalizeAndStop();
      await ulProvider.init();
      expect(initSpy).to.be.calledTwice;
      expect(stopSpy).to.be.calledOnce;
    });

    it('should initialize once with multiple call', async () => {
      ulProvider.init();
      ulProvider.init();
      ulProvider.init();
      await ulProvider.init();
      await ulProvider.finalizeAndStop();
      expect(initSpy).to.be.calledOnce;
      expect(stopSpy).to.be.calledOnce;
    });

    afterEach(() => {
      initSpy.resetHistory();
      stopSpy.resetHistory();
    });
  });
});
