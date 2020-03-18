import {expect} from 'chai';
import sinon from 'sinon';
import {ReferenceCountedState} from '../../../src/core/states/ReferenceCountedState';

class TestState extends ReferenceCountedState<number> {
  constructor() {
    super(0);
  }

  onFirstSubscribe = sinon.spy();

  onLastUnsubscribe = sinon.spy();
}

describe('UNIT: ReferenceCountedState', () => {
  let state: ReferenceCountedState<number>;
  let callback: sinon.SinonSpy;

  beforeEach(() => {
    state = new TestState();
    callback = sinon.spy();
  });

  it('no subscriptions', () => {
    state = new TestState();
    expect(state.get()).to.eq(0);
  });

  it('1 subscription', () => {
    const unsubscribe = state.subscribe(callback);
    expect(state.onFirstSubscribe).to.have.been.calledOnce;
    unsubscribe();
    expect(state.onLastUnsubscribe).to.have.been.calledOnce;
  });

  it('2 subscriptions', () => {
    const unsubscribe = state.subscribe(callback);
    const unsubscribe2 = state.subscribe(callback);
    expect(state.onFirstSubscribe).to.have.been.calledOnce;
    unsubscribe();
    unsubscribe2();
    expect(state.onLastUnsubscribe).to.have.been.calledOnce;
  });
});
