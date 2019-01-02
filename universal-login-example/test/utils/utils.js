import chai, {expect} from 'chai';
import {waitUntil, getLogs, sleep} from '../utils';
import chaiAsPromised from 'chai-as-promised';
import {convertIPv6ToIPv4, filterIP, debounce} from '../../src/utils';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import Clicker from '../../build/Clicker';
import sinon from 'sinon';

chai.use(chaiAsPromised);

describe('Utils', async () => {
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
      };
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
    });
  });

  describe('getLogs', () => {
    let provider;
    let wallet;
    let clickerContract;

    before(async () => {
      provider = createMockProvider();
      [wallet] = await getWallets(provider);
      clickerContract = await deployContract(wallet, Clicker);
    });

    it('getLogs', async () => {
      await clickerContract.press();
      await expect(clickerContract.press())
        .to.emit(clickerContract, 'ButtonPress');
      const actualLogs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress'); 
      expect(actualLogs[0]).to.deep.include({presser: wallet.address});
    });
  });

  describe('debounce', () => {
    const tick = 10;
    it('works for one callback at one time', async () => {
      const callback = sinon.spy();
      const debounceCallback = debounce(callback, 0);
      debounceCallback();
      await sleep(0);
      expect(callback).to.have.been.calledOnce;
    });

    it('works for a lot of callbacks', async () => {
      const callback = sinon.spy();
      const debounceCallback = debounce(callback, tick);
      debounceCallback();
      debounceCallback();
      debounceCallback();
      debounceCallback();
      debounceCallback();
      debounceCallback();
      await sleep(tick);
      expect(callback).to.have.been.calledOnce;
    });

    it('works with args', async () => {
      const callback = sinon.spy();
      const args = 'some args';
      const debounceCallback = debounce(callback, tick);
      debounceCallback(args);
      await sleep(tick);
      expect(callback).to.have.been.calledWith(args);
    });

    it('works with a lot of args', async () => {
      const callback = sinon.spy();
      let args = 0;
      const debounceCallback = debounce(callback, tick);
      debounceCallback(args);
      args++;
      debounceCallback(args);
      args++;
      debounceCallback(args);
      args++;
      debounceCallback(args);
      args++;
      debounceCallback(args);
      args++;
      debounceCallback(args);
      args++;
      debounceCallback(args);
      await sleep(tick);
      expect(callback).to.have.been.calledWith(args);
    });
  });
});
