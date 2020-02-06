import {expect} from 'chai';
import sinon from 'sinon';
import {Web3PickerProvider} from '../src/Web3PickerProvider';
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

  let web3Strategy: Web3PickerProvider;

  beforeEach(() => {
    web3Strategy = new Web3PickerProvider(factories, {send: () => sendReadSpy()} as Provider);
    web3Strategy.show = sinon.stub().resolves(undefined);
  });

  it('Pick ul provider', async () => {
    await web3Strategy.setProvider(universalLoginProviderFactory.name);
    expect(createStub.calledOnce).to.be.true;
    web3Strategy.send(jsonRpcReq, () => {});
    expect(sendSpy.calledOnce).to.be.true;
    expect(sendReadSpy.called).to.be.false;
  });

  it('Pick not existed provider', async () => {
    await expect(web3Strategy.setProvider('non-exist-name'))
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
