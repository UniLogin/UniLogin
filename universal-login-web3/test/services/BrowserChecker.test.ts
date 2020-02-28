import {expect} from 'chai';
import {BrowserChecker} from '../../src/services/BrowserChecker';

describe('BrowserChecker', () => {
  const window = {localStorage: undefined, navigator: {}, document: {documentElement: {style: {}}}} as any;
  const browserChecker = new BrowserChecker(window);

  describe('Localstorage', () => {
    it('retruns false if localstorage is not available', () => {
      expect(browserChecker.isLocalStorageBlocked()).to.be.true;
    });

    it('retruns true if localstorage is available', () => {
      window.localStorage = {setItem: () => {}, removeItem: () => {}};
      expect(browserChecker.isLocalStorageBlocked()).to.be.false;
    });
  });
});
