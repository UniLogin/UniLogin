import {expect} from 'chai';
import {getInitialOnboardingLocation, getInitialEmailOnboardingLocation} from '../../src/app/getInitialOnboardingLocation';
import {WalletState} from '@unilogin/sdk';

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

describe('UNIT: getInitialEmailOnboardingLocation', () => {
  const createTestWalletState = (kind: string, wallet?: any) => ({kind, wallet} as WalletState);

  it('None', () => {
    const walletState = createTestWalletState('None');
    expect(getInitialEmailOnboardingLocation(walletState)).to.eq('/email');
  });

  it('RequestedCreating', () => {
    const walletState = createTestWalletState('RequestedCreating');
    expect(getInitialEmailOnboardingLocation(walletState)).to.eq('/code');
  });

  it('Confirmed', () => {
    const walletState = createTestWalletState('Confirmed');
    expect(getInitialEmailOnboardingLocation(walletState)).to.eq('/create');
  });

  it('Future', () => {
    const walletState = createTestWalletState('Future');
    expect(getInitialEmailOnboardingLocation(walletState)).to.eq('/create');
  });

  it('Deploying', () => {
    const walletState = createTestWalletState('Deploying');
    expect(getInitialEmailOnboardingLocation(walletState)).to.eq('/create');
  });

  it('Connecting', () => {
    const walletState = createTestWalletState('Connecting');
    expect(() => getInitialEmailOnboardingLocation(walletState)).to.throw('Unexpected wallet state: Connecting');
  });

  it('Deployed', () => {
    const walletState = createTestWalletState('Deployed');
    expect(() => getInitialEmailOnboardingLocation(walletState)).to.throw('Unexpected wallet state: Deployed');
  });
});
