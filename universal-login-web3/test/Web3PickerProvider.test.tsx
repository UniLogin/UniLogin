import {expect} from 'chai';
import sinon from 'sinon';
import {promisify} from 'util';
import {Web3PickerProvider} from '../src/Web3PickerProvider';
import {Provider} from 'web3/providers';
import {IWeb3PickerComponentProps} from '../src/ui/react/Web3PickerComponent';
import {waitExpect} from '@unilogin/commons/testutils';

describe('UNIT: Web3Picker', () => {
  const readProvider = {send: sinon.spy()};
  const ulProvider = {send: sinon.spy()};
  const ulFactory = {
    name: 'UniLogin',
    icon: 'UniLogin logo',
    create: sinon.stub().resolves(ulProvider),
  };
  const rpcRequest = (method = 'eth_blockNumber') => ({
    jsonrpc: 'jsonrpc',
    method,
    params: [],
    id: 1,
  });

  let web3Strategy: Web3PickerProvider;
  let services: IWeb3PickerComponentProps;

  beforeEach(() => {
    web3Strategy = new Web3PickerProvider([ulFactory], readProvider as Provider, props => {
      services = props;
    });
  });

  it('proxies all requests to picked provider', async () => {
    await web3Strategy.setProvider(ulFactory.name);
    expect(ulFactory.create).to.be.called;
    await web3Strategy.send(rpcRequest(), () => {
    });
    expect(ulProvider.send).to.be.called;
    expect(readProvider.send).to.not.be.called;
  });

  it('picking non-existent provider throws', async () => {
    await expect(web3Strategy.setProvider('non-exist-name'))
      .rejectedWith('Invalid provider: non-exist-name');
  });

  it('account independent RPCs are sent to read provider if no other is set', async () => {
    await web3Strategy.send(rpcRequest(), () => {
    });
    expect(readProvider.send).to.be.called;
    expect(ulFactory.create).to.not.be.called;
    expect(ulProvider.send).to.not.be.called;
  });

  it('eth_accounts returns [] if no provider is set', async () => {
    const res = await promisify(web3Strategy.send.bind(web3Strategy))(rpcRequest('eth_accounts'));
    expect((res as any).result).to.deep.eq([]);
  });

  it('sending account dependent rpc shows the picker UI and setting the provider hides it', async () => {
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    await waitExpect(() => expect(services.isVisibleProp.get()).to.be.true);
    services.setProvider(ulFactory.name);
    services.hideModal();
    await waitExpect(() => expect(services.isVisibleProp.get()).to.be.false);
  });

  it('first RPC gets proxied to selected provider', async () => {
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    services.setProvider(ulFactory.name);
    services.hideModal();
    await waitExpect(() => expect(ulProvider.send).to.be.called);
  });

  it('subsequent RPCs are ignored', async () => {
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    services.setProvider(ulFactory.name);
    services.hideModal();
    await waitExpect(() => expect(ulProvider.send).to.be.calledOnce);
  });

  it('RPCs are ignored if the picker UI is closed without selecting a provider', async () => {
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    web3Strategy.send(rpcRequest('eth_sendTransaction'), () => { });
    services.hideModal();
    await waitExpect(() => expect(ulFactory.create).to.not.be.called);
    expect(ulProvider.send).to.not.be.called;
    expect(readProvider.send).to.not.be.called;
  });

  afterEach(() => {
    readProvider.send.resetHistory();
    ulProvider.send.resetHistory();
    ulFactory.create.resetHistory();
  });
});
