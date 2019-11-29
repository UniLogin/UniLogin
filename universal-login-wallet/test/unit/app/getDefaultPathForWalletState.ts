import {expect} from 'chai';
import {getDefaultPathForWalletState} from '../../../src/app/getDefaultPathForWalletState';

describe('UNIT: getDefaultPathForWalletState', () => {
  it('return proper path for Future', () => {
    expect(getDefaultPathForWalletState('Future')).to.be.eq('/create');
  });

  it('return proper path for Future', () => {
    expect(getDefaultPathForWalletState('Deployed')).to.be.eq('/wallet');
  });

  it('return proper path for Future', () => {
    expect(getDefaultPathForWalletState('Deploying')).to.be.eq('/create');
  });

  it('return proper path for Future', () => {
    expect(getDefaultPathForWalletState('None')).to.be.eq('/welcome');
  });
});
