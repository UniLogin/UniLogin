import chai, {expect} from 'chai';
import {waitUntil, getLogs} from '../utils';
import chaiAsPromised from 'chai-as-promised';
import {convertIPv6ToIPv4, filterIP} from '../../src/utils';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import Clicker from '../../build/Clicker';
import {utils} from 'ethers';

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

  describe('getLogs', () => {
    let provider;
    let wallet;
    let clickerContract;
    let topic;
    let clickerInterface;

    before(async () => {
      provider = createMockProvider();
      [wallet] = await getWallets(provider);
      clickerContract = await deployContract(wallet, Clicker);
      clickerInterface = new utils.Interface(Clicker.interface);
      topic = new utils.Interface(Clicker.interface).events.ButtonPress.topic;
    });

    async function awesomeGetLogs(provider, address, contractJson, eventName) {
      const topic = new utils.Interface(contractJson.interface).events[eventName].topic;
      const contractInterface = new utils.Interface(contractJson.interface);
      return getLogs(provider, {fromBlock: 0, address, topics: [topic]}, contractInterface);
    }

    it('getLogs', async () => {
      await clickerContract.press();
      await expect(clickerContract.press())
        .to.emit(clickerContract, 'ButtonPress');
      const actualLogs = await getLogs(provider, clickerContract.address, Clicker, 'ButtonPress'); 
      expect(actualLogs[0]).to.deep.include({presser: wallet.address});
    });
  });
});
