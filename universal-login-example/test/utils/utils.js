import chai, {expect} from 'chai';
import {classnames} from '../../src/utils';
import {waitUntil} from '../utils';
import chaiAsPromised from 'chai-as-promised';
import {convertIPv6ToIPv4, filterIP} from '../../src/utils';

chai.use(chaiAsPromised);

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

  describe('waitUntil', async () => {
    it('should return true, if function returns true', async () => {
      const func = () => true;
      expect(await waitUntil(func)).to.be.true;
    });

    it('should throw error, if timeout', async () => {      
      const func = () => false;
      await expect(waitUntil(func, 1, 10)).to.be.eventually.rejectedWith('Timeout');
    });

    it('should return true, if iteration', async () => {      
      let count = 0;
      const func = () => {
        count++;
        return count === 3;
      }
      expect(await waitUntil(func, 1)).to.be.true;
      expect(count).to.eq(3);
    });
  });

  describe('IP address', () => {
    it('should return IP address', () => {
      expect(convertIPv6ToIPv4('::ffff:10.9.16.164')).to.eq('10.9.16.164');
      expect(convertIPv6ToIPv4('10.9.16.164')).to.eq('10.9.16.164');
    });

    it('filterIP', () => {
      expect(filterIP('::1')).to.eq('localhost');
      expect(filterIP('127.0.0.1')).to.eq('localhost');
      expect(filterIP('::ffff:127.0.0.1')).to.eq('localhost');
      expect(filterIP('10.9.16.164')).to.eq('10.9.16.164');
      expect(filterIP('::ffff:10.9.16.164')).to.eq('10.9.16.164');
    })
  });
});
