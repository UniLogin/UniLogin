import {expect} from 'chai';
import sinon from 'sinon';
import {Web3Picker} from '../src/ui/react/Web3Picker';
import {Web3Strategy} from '../src/Web3Strategy';
import {Web3ProviderFactory} from '../src/models/Web3ProviderFactory';
import {Provider} from 'web3/providers';

describe('UNIT: Web3Picker', () => {
  const sendSpy = sinon.spy();
  const sendReadSpy = sinon.spy();
  const createStub = sinon.stub().resolves({send: () => sendSpy()});
  const universalLoginProviderFactory: Web3ProviderFactory = {
    name: 'UniversalLogin',
    icon: 'UniversalLogin logo',
    create: createStub,
  };
  const factories = [
    universalLoginProviderFactory,
  ];

  const jsonRpcReq = {
    jsonrpc: 'jsonrpc',
    method: 'eth_accounts',
    params: [],
    id: 1,
  };

  let web3Strategy: Web3Strategy;
  let web3Picker: Web3Picker;

  beforeEach(() => {
    web3Strategy = new Web3Strategy(factories, {send: () => sendReadSpy()} as Provider);
    web3Picker = new Web3Picker(web3Strategy, factories);
    web3Picker.show = sinon.stub().returns({waitForPick: async () => {}});
    web3Strategy.web3picker = web3Picker;
  });

  it('Pick ul provider', async () => {
    await web3Picker.setProvider(universalLoginProviderFactory.name);
    expect(createStub.calledOnce).to.be.true;
    web3Strategy.send(jsonRpcReq, () => {});
    expect(sendSpy.calledOnce).to.be.true;
    expect(sendReadSpy.called).to.be.false;
  });

  it('Pick not existed provider', async () => {
    await expect(web3Picker.setProvider('non-exist-name'))
      .rejectedWith('Invalid provider: non-exist-name');
  });

  it('Send read method should use readonlyProvider', () => {
    web3Strategy.send({...jsonRpcReq, method: 'eth_blockNumber'}, () => {});
    expect(sendReadSpy.calledOnce).to.be.true;
    expect(createStub.called).to.be.false;
    expect(sendSpy.called).to.be.false;
  });

  afterEach(() => {
    sendReadSpy.resetHistory();
    sendSpy.resetHistory();
    createStub.resetHistory();
  });
});
