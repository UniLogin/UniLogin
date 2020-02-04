import {expect} from 'chai';
import {setupStrategies} from '../../src/utils/setupStrategies';
import {Web3ProviderFactory} from '../../src/models/Web3ProviderFactory';

describe('UNIT: setupStrategies', () => {
  it('return UniLogin strategy for UniLogin', () => {
    const web3 = {currentProvider: {}};
    const result = setupStrategies(web3 as any, ['UniLogin']);
    expect(result[0].name).to.eq('UniversalLogin');
    expect(result[0].icon).to.eq('UniversalLogin logo');
    expect(result[0].create).to.not.be.null;
  });

  it('return Metamask strategy for Metamask', () => {
    const web3 = {currentProvider: {}};
    const result = setupStrategies(web3 as any, ['Metamask']);
    expect(result[0].name).to.eq('Metamask');
    expect(result[0].icon).to.eq('Metamask logo');
    expect(result[0].create()).to.eq(web3);
  });

  it('return strategy if strategy was provided', async () => {
    const web3 = {currentProvider: {}};
    const strategy: Web3ProviderFactory = {name: 'SomeStrategy', icon: 'Icon', create: () => web3 as any};
    const result = setupStrategies(web3 as any, [strategy]);
    expect(result[0].name).to.deep.eq(strategy.name);
    expect(result[0].icon).to.deep.eq(strategy.icon);
    expect(result[0].create()).to.deep.eq(web3);
  });
});