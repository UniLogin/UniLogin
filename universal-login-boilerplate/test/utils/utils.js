import {expect} from 'chai';
import {classnames} from '../../src/utils';

describe('Utils', async () => {
  describe('classnames', async () => {
    it('empty', async () => {
      expect(classnames({})).to.eq('');
    });

    it('one positive', async () => {
      expect(classnames({a: true})).to.eq('a');
    });

    it('one negative', async () => {
      expect(classnames({a: false})).to.eq('');
    });

    it('mulitple positive', async () => {
      expect(classnames({a: 1, b: true})).to.eq('a b');
    });

    it('mulitple negative', async () => {
      expect(classnames({a: false, b: 0})).to.eq('');
    });

    it('mulitple mixed', async () => {
      expect(classnames({a: 1, b: 1, c: false, d: 0, ef: true})).to.eq('a b ef');
    });
  });
});
