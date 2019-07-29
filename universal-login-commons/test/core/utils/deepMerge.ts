import {expect} from 'chai';
import {deepMerge} from '../../../lib/core/utils/deepMerge';

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
});
