import {expect} from 'chai';
import {ensure, ensureNotEmpty, ensureNotFalsy, ensureNotNullish, Nullable} from '../../../../src';

describe('ensure', () => {
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

    it('undefined', () => {
      expect(() => ensureNotFalsy(undefined, Error, 'undefined')).to.throw(Error, 'undefined');
    });

    it('string', () => {
      expect(() => ensureNotFalsy('test', Error, 'MyOwnArg')).to.not.throw(Error);
    });
  });

  describe('ensureNotNullish', () => {
    it('null inlined', () => {
      expect(() => ensureNotNullish(null, Error, 'null')).to.throw(Error, 'null');
    });

    it('null value', () => {
      const value: Nullable<number> = null;
      expect(() => ensureNotNullish(value, Error, 'null')).to.throw(Error, 'null');
    });

    it('non-null value', () => {
      const value: Nullable<number> = 5;
      expect(() => ensureNotNullish(value, Error, 'null')).to.not.throw(Error);
    });

    it('falsy value', () => {
      const value: Nullable<number> = 0;
      expect(() => ensureNotNullish(value, Error, 'null')).to.not.throw(Error);
    });

    it('undefined', () => {
      expect(() => ensureNotNullish(undefined, Error, 'undefined')).to.throw(Error);
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
