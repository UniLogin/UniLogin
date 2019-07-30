import {expect} from 'chai';
import {deepCopy} from '../../../lib/core/utils/deepCopy';

describe('deepCopy', () => {
  it('copy should not change when change the 1st level', () => {
    const obj = {
      a1: 1,
      a2: 2
    };
    const copy = deepCopy(obj);
    obj.a1 = 100;
    expect(copy).not.deep.eq(obj);
    expect(copy.a1).to.eq(1);
    expect(obj.a1).to.eq(100);
  });

  it('copy should not change when change the 2nd level', () => {
    const obj = {
      a1: 1,
      a2: {
        b1: 1,
        b2: 2,
      }
    };
    const copy = deepCopy(obj);
    obj.a2.b1 = 100;
    expect(copy).not.deep.eq(obj);
    expect(copy.a2.b1).to.eq(1);
    expect(obj.a2.b1).to.eq(100);
  });

  it('copy should not change when change the 3rd level', () => {
    const obj = {
      a1: 1,
      a2: {
        b1: 1,
        b2: 2,
        b3: {
          c1: 1,
          c2: 2
        }
      }
    };
    const copy = deepCopy(obj);
    obj.a2.b3.c1 = 100;
    expect(copy).not.deep.eq(obj);
    expect(copy.a2.b3.c1).to.eq(1);
    expect(obj.a2.b3.c1).to.eq(100);
  });
});