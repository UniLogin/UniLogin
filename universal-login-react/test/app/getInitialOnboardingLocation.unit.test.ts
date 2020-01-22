import {expect} from 'chai';
import {getInitialOnboardingLocation} from '../../src/app/getInitialOnboardingLocation';
import {WalletState} from '@universal-login/sdk';

describe('UNIT: getInitialOnboardingLocation', () => {
  const createTestWalletState = (kind: string, wallet?: any) => ({kind, wallet} as WalletState);

  it('None', () => {
    const walletState = createTestWalletState('None');
    expect(getInitialOnboardingLocation(walletState)).to.eq('/selector');
  });

  it('Future', () => {
    const walletState = createTestWalletState('Future');
    expect(getInitialOnboardingLocation(walletState)).to.eq('/create');
  });

  it('Deploying', () => {
    const walletState = createTestWalletState('Deploying');
    expect(getInitialOnboardingLocation(walletState)).to.eq('/create');
  });

  it('Connecting', () => {
    const expectedEnsName = 'example.mylogin.eth';
    const walletState = createTestWalletState('Connecting', {name: expectedEnsName});
    expect(getInitialOnboardingLocation(walletState)).to.deep.eq({
      pathname: '/connectFlow/emoji',
      state: {name: expectedEnsName},
    });
  });

  it('Deployed', () => {
    const walletState = createTestWalletState('Deployed');
    expect(() => getInitialOnboardingLocation(walletState)).to.throw('Unexpected wallet state: Deployed');
  });
});
