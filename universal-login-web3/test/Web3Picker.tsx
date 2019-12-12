import {expect} from 'chai';
import {Web3Picker} from '../lib/ui/react/Web3Picker';

const expectedProviders = [
  {name: 'UniversalLogin', icon: 'UniversalLogin logo'},
];

describe('UNIT: Web3Picker', () => {
  const web3Picker = new Web3Picker();

  it('Pick not existed web3', () => {
    expect(web3Picker.getProviders()[0]).to.deep.include(expectedProviders);
    expect(web3Picker.getCurrentProvider()).to.be.undefined;

    expect(() => web3Picker.setProvider('non-exist-name'))
      .throws('Provider is not exist. Invalid name: non-exist-name');
    web3Picker.setProvider('UniversalLogin');
  });

  xit('Pick classic web3', () => {});

  xit('Pick custom web3', () => {});
});
