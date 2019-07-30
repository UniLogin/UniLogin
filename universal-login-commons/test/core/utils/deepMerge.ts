import {expect} from 'chai';
import {deepMerge, isProperObject} from '../../../lib/core/utils/deepMerge';

describe('UNIT: deepMerge', () => {
  const obj1 = {
    a1: 1,
    a2: 2,
    b: {
      c1: 1,
      c2: 2,
    }
  };

  const obj2 = {
    a1: 10,
    b: {
      c2: 20,
    }
  };

  it('merge obj1 with obj2', () => {
    expect(deepMerge(obj1, obj2)).to.deep.eq({
      a1: 10,
      a2: 2,
      b: {
        c1: 1,
        c2: 20,
      }
    });
  });

  it('merge obj2 with obj1', () => {
    expect(deepMerge(obj2, obj1)).to.be.deep.eq(obj1);
  });

  it('empty merged to non-empty', () => {
    expect(deepMerge({}, obj1)).to.deep.eq(obj1);
  });

  it('non-empty merged to empty', () => {
    expect(deepMerge(obj1, {})).to.deep.eq(obj1);
  });

  it('flat merged to flat', () => {
    const a = {
      a: '10',
      c: '30'
    };
    const b = {
      b: '20',
      c: '50'
    };
    expect(deepMerge(a, b)).to.deep.eq({
      a: '10',
      b: '20',
      c: '50'
    });
  });

  it('3 levels', () => {
    const a = {
      a1: 1,
      a2: 2,
      b: {
        c1: 1,
        c2: {
          d1: 1,
          d2: 2
        },
      }
    };
    const b = {
      a1: 10,
      b: {
        c2: {
          d1: 10
        },
        c3: 30
      }
    };
    expect(deepMerge(a, b)).to.be.deep.eq({
      a1: 10,
      a2: 2,
      b: {
        c1: 1,
        c2: {
          d1: 10,
          d2: 2
        },
        c3: 30
      }
    });
  });

  describe('isProperObject', () => {
    it('null', () => {
      expect(isProperObject(null)).to.be.false;
    });

    it('number', () => {
      expect(isProperObject(4)).to.be.false;
    });

    it('string', () => {
      expect(isProperObject('string')).to.be.false;
    });

    it('empty object', () => {
      expect(isProperObject({})).to.be.true;
    });

    it('non-empty object', () => {
      expect(isProperObject({a: 3, b: '40'})).to.be.true;
    });
  });
});
