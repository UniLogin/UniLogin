import {expect} from 'chai';
import {ensure, ensureNotEmpty, ensureNotFalsy} from '../../src';

describe('handleError', () => {
  describe('ensure', () => {
    it('ensure false', () => {
      expect(() => ensure(false, Error, 'MyOwnArg')).to.throw(Error, 'MyOwnArg');
    });

    it('ensure true', () => {
      expect(() => ensure(true, Error, 'MyOwnArg')).to.not.throw(Error);
    });
  });

  describe('ensureNotFalsy', () => {
    it('null', () => {
      expect(() => ensureNotFalsy(null, Error, 'null')).to.throw(Error, 'null');
    });

    it('null', () => {
      expect(() => ensureNotFalsy(undefined, Error, 'undefined')).to.throw(Error, 'undefined');
    });

    it('not null', () => {
      expect(() => ensureNotFalsy('test', Error, 'MyOwnArg')).to.not.throw(Error);
    });
  });

  describe('ensureNotEmpty', () => {
    it('empty object', () => {
      expect(() => ensureNotEmpty({}, Error, 'Empty object')).to.throw(Error, 'Empty object');
    });

    it('not empty object', () => {
      expect(() => ensureNotEmpty({test: 'test'}, Error, 'MyOwnArg')).to.not.throw(Error);
    });
  });
});
