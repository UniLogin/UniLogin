import {expect} from 'chai';
import sinon from 'sinon';
import {ReferenceCountedState} from '../../../src/core/states/ReferenceCountedState';

class TestProperty extends ReferenceCountedState<number> {
  constructor() {
    super(0);
  }

  onFirstSubscribe = sinon.spy();

  onLastUnsubscribe = sinon.spy();
}

describe('UNIT: ReferenceCountedProperty', () => {
  let property: ReferenceCountedState<number>;
  let callback: ReturnType<typeof sinon.spy>;

  beforeEach(() => {
    property = new TestProperty();
    callback = sinon.spy();
  });

  it('no subscriptions', () => {
    property = new TestProperty();
    expect(property.get()).to.eq(0);
  });

  it('1 subscription', async () => {
    const unsubscribe = property.subscribe(callback);
    expect(property.onFirstSubscribe).to.have.been.calledOnce;
    unsubscribe();
    expect(property.onLastUnsubscribe).to.have.been.calledOnce;
  });

  it('2 subscriptions', async () => {
    const unsubscribe = property.subscribe(callback);
    const unsubscribe2 = property.subscribe(callback);
    expect(property.onFirstSubscribe).to.have.been.calledOnce;
    unsubscribe();
    unsubscribe2();
    expect(property.onLastUnsubscribe).to.have.been.calledOnce;
  });
});
