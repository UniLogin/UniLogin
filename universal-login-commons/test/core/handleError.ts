import {expect} from 'chai';
import {ensure} from '../../lib';

describe('handleError', () => {
  describe('ensure', () => {
    it('ensure false', () => {
      expect(() => ensure(false, Error, 'MyOwnArg')).to.throw(Error, 'MyOwnArg');
    });

    it('ensure true', () => {
      expect(() => ensure(true, Error, 'MyOwnArg')).to.not.throw(Error);
    });
  });
});
