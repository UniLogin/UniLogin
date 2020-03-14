import {expect} from 'chai';
import sinon from 'sinon';
import {InitializationHandler} from '../../../src/core/utils/InitializationHandler';

describe('UNIT: InitializationHandler', () => {
  describe('sync', () => {
    const initialize = sinon.stub();
    const finalize = sinon.stub();
    let initializationHandler: InitializationHandler<void, void>;

    beforeEach(() => {
      initializationHandler = new InitializationHandler(() => initialize(), () => finalize());
    });

    it('call initialize', () => {
      initializationHandler.initialize();
      expect(initialize).to.be.calledOnce;
    });

    it('call initialize x3', () => {
      initializationHandler.initialize();
      initializationHandler.initialize();
      initializationHandler.initialize();
      expect(initialize).to.be.calledOnce;
    });

    it('initialize -> finalize', () => {
      initializationHandler.initialize();
      initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('finalize -> initialize -> finalize', () => {
      initializationHandler.finalize();
      initializationHandler.initialize();
      initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('initialize -> finalize -> initialize', () => {
      initializationHandler.initialize();
      initializationHandler.finalize();
      initializationHandler.initialize();
      expect(initialize).to.be.calledTwice;
      expect(finalize).to.be.calledOnce;
    });

    afterEach(() => {
      sinon.resetHistory();
    });
  });

  describe('async', () => {
    const initialize = sinon.stub().resolves();
    const finalize = sinon.stub().resolves();
    let initializationHandler: InitializationHandler<Promise<void>, Promise<void>>;

    beforeEach(() => {
      initializationHandler = new InitializationHandler(() => initialize(), () => finalize());
    });

    it('call initialize', async () => {
      await initializationHandler.initialize();
      expect(initialize).to.be.calledOnce;
    });

    it('call initialize x3', async () => {
      initializationHandler.initialize();
      initializationHandler.initialize();
      await initializationHandler.initialize();
      expect(initialize).to.be.calledOnce;
    });

    it('initialize -> finalize', async () => {
      await initializationHandler.initialize();
      await initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('finalize -> initialize -> finalize', async () => {
      await initializationHandler.finalize();
      await initializationHandler.initialize();
      await initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('initialize -> finalize -> initialize', async () => {
      initializationHandler.initialize();
      initializationHandler.initialize();
      await initializationHandler.initialize();
      await initializationHandler.finalize();
      initializationHandler.initialize();
      initializationHandler.initialize();
      await initializationHandler.initialize();
      expect(initialize).to.be.calledTwice;
      expect(finalize).to.be.calledOnce;
    });

    afterEach(() => {
      sinon.resetHistory();
    });
  });

  describe('duration of promises', () => {
    const initializeStart = sinon.spy();
    const initializeFinish = sinon.spy();
    const initialize = () => {
      initializeStart();
      return new Promise(resolve => setTimeout(() => resolve(initializeFinish()), 5));
    };
    const finalizeStart = sinon.spy();
    const finalizeFinish = sinon.spy();
    const finalize = () => {
      finalizeStart();
      return new Promise(resolve => setTimeout(() => resolve(finalizeFinish()), 1));
    };
    let initializationHandler: InitializationHandler<unknown, unknown>;

    beforeEach(() => {
      initializationHandler = new InitializationHandler(() => initialize(), () => finalize());
    });

    it('initialize finish before finalize starts with awaits', async () => {
      await initializationHandler.initialize();
      await initializationHandler.finalize();
      expect(initializeStart).to.be.calledOnce;
      expect(initializeFinish).to.be.calledImmediatelyAfter(initializeStart);
      expect(finalizeStart).to.be.calledImmediatelyAfter(initializeFinish);
      expect(finalizeFinish).to.be.calledImmediatelyAfter(finalizeStart);
    });

    it('initialize finish before finalize starts without awaits', async () => {
      const initializePromise = initializationHandler.initialize();
      expect(() => initializationHandler.finalize()).throws('Cannot finalize during initializing');
      await initializePromise;
      expect(initializeStart).to.be.calledOnce;
      expect(initializeFinish).to.be.calledOnce;
      expect(initializeFinish).to.be.calledImmediatelyAfter(initializeStart);
      expect(finalizeStart).to.be.not.called;
      expect(finalizeFinish).to.be.not.called;
    });

    afterEach(() => {
      sinon.resetHistory();
    });
  });
});
