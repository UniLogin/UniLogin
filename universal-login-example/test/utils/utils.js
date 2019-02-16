import chai, {expect} from 'chai';
import {getLogs} from '../utils';
import chaiAsPromised from 'chai-as-promised';
import {convertIPv6ToIPv4, filterIP} from '../../src/utils';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import Clicker from '../../build/Clicker';

chai.use(chaiAsPromised);

describe('Utils', async () => {
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
});

