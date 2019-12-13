import {expect} from 'chai';
import {Web3Picker} from '../lib/ui/react/Web3Picker';
import {getConfigForNetwork} from '../lib/config';
import {universalLoginCustomProvider} from '../lib/Web3ProviderFactory';

const expectedProviders = [
  {name: 'UniversalLogin', icon: 'UniversalLogin logo'},
];

describe('UNIT: Web3Picker', () => {
  const {provider} = getConfigForNetwork('kovan');
  const web3Picker = new Web3Picker(provider);

  it('Init provider', () => {
    expect(web3Picker.get()).deep.eq(provider);
  });

  it('Pick not existed provider', () => {
    expect(() => web3Picker.setProvider('non-exist-name'))
      .throws('Provider is not exist. Invalid name: non-exist-name');
  });

  it('Pick ul web3', () => {
    const expectedProviderName = universalLoginCustomProvider.name;
    console.log('expectedProvider is created');
    web3Picker.setProvider(universalLoginCustomProvider.name);
    expect(web3Picker.currentCustomProvider?.name).to.be.deep.eq(expectedProviderName);
  });

  xit('Pick custom web3', () => {});
});
