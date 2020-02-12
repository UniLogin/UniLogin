import {expect} from 'chai';
import {MemoryStorageService} from '@universal-login/sdk';
import {setupStrategies} from '../../src/api/setupStrategies';
import {Web3ProviderFactory} from '../../src/models/Web3ProviderFactory';
import UniLoginLogo from '../../src/ui/assets/U.svg';
import MetamaskLogo from '../../src/ui/assets/MetaMaskLogoTitle.svg';

describe('UNIT: setupStrategies', () => {
  const mockProvider = {send: (_: any, cb: any) => cb(null, {result: '1'})};

  it('return UniLogin strategy for UniLogin', async () => {
    const applicationInfo = {
      applicationName: 'Kickback',
      logo: 'https://kickback.events/favicon.ico',
      type: 'laptop',
    };
    const result = setupStrategies(mockProvider, ['UniLogin'], {applicationInfo, storageService: new MemoryStorageService()});
    expect(result[0].name).to.eq('UniversalLogin');
    expect(result[0].icon).to.eq(UniLoginLogo);
    expect(result[0].create).to.not.be.null;
    const ulWeb3Provider = await result[0].create();
    expect((ulWeb3Provider as any).sdk.sdkConfig.applicationInfo).to.deep.eq(applicationInfo);
    await (ulWeb3Provider as any).finalizeAndStop();
  });

  it('return Metamask strategy for Metamask', () => {
    const result = setupStrategies(mockProvider, ['Metamask']);
    expect(result[0].name).to.eq('Metamask');
    expect(result[0].icon).to.eq(MetamaskLogo);
    expect(result[0].create()).to.eq(mockProvider);
  });

  it('return strategy if strategy was provided', async () => {
    const strategy: Web3ProviderFactory = {name: 'SomeStrategy', icon: 'Icon', create: () => mockProvider};
    const result = setupStrategies(mockProvider, [strategy]);
    expect(result[0].name).to.deep.eq(strategy.name);
    expect(result[0].icon).to.deep.eq(strategy.icon);
    expect(result[0].create()).to.deep.eq(mockProvider);
  });
});
