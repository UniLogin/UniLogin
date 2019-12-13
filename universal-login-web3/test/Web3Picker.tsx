import {expect} from 'chai';
import sinon from 'sinon';
import {Web3Picker} from '../lib/ui/react/Web3Picker';
import {Web3Strategy} from '../lib/Web3Strategy';
import {Web3ProviderFactory} from '../lib/Web3ProviderFactory';

describe('UNIT: Web3Picker', () => {
  const sendSpy = sinon.spy();
  const universalLoginProviderFactory: Web3ProviderFactory = {
    name: 'UniversalLogin',
    icon: 'UniversalLogin logo',
    create: () => ({send: sendSpy()}),
  };
  const createSpy = sinon.spy(universalLoginProviderFactory, 'create');
  const factories = [
    universalLoginProviderFactory,
  ];
  const web3Strategy = new Web3Strategy(factories);
  const web3Picker = new Web3Picker(web3Strategy, factories);
  web3Picker.show = sinon.stub().returns({waitForPick: async () => {}});
  web3Strategy.web3picker = web3Picker;
  const jsonRpcReq = {
    jsonrpc: 'jsonrpc',
    method: 'GET',
    params: [],
    id: 1,
  };

  it('Pick ul provider', () => {
    web3Strategy.send(jsonRpcReq, () => {});
    web3Picker.setProvider(universalLoginProviderFactory.name);
    expect(createSpy.calledOnce).to.be.true;
    expect(sendSpy.calledOnce).to.be.true;
  });

  it('Pick not existed provider', () => {
    expect(() => web3Picker.setProvider('non-exist-name'))
      .throws('Provider is not exist. Invalid name: non-exist-name');
  });

  xit('Pick custom web3', () => {});
});
