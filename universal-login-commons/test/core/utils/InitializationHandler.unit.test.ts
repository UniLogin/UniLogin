import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {InitializationHandler} from '../../../src/core/utils/InitializationHandler';

chai.use(sinonChai);

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
      initializationHandler.initialize();
      await initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('finalize -> initialize -> finalize', async () => {
      initializationHandler.finalize();
      initializationHandler.initialize();
      await initializationHandler.finalize();
      expect(initialize).to.be.calledOnce;
      expect(finalize).to.be.calledOnce;
    });

    it('initialize -> finalize -> initialize', async () => {
      initializationHandler.initialize();
      initializationHandler.initialize();
      initializationHandler.initialize();
      initializationHandler.finalize();
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
});
