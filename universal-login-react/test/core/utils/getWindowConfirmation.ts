import {expect} from 'chai';
import sinon from 'sinon';
import {getWindowConfirmation} from '../../../src/core/utils/getWindowConfirmation';

describe('UNIT: getWindowConfirmation', () => {
  it('should always get window confirmation in test environment', () => {
    const callback = sinon.spy();
    getWindowConfirmation('Can I', callback);
    expect(callback).to.be.calledOnceWithExactly(true);
  });
});
