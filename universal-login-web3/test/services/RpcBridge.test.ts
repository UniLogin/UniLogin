import {RpcBridge} from '../../src/services/RpcBridge';
import sinon, {SinonStub} from 'sinon';
import {expect} from 'chai';
import {sleep} from '@unilogin/commons';

describe('INT: RpcBridge', () => {
  let alice: RpcBridge;
  let bob: RpcBridge;
  let aliceHandle: SinonStub;
  let bobHandle: SinonStub;

  beforeEach(() => {
    aliceHandle = sinon.stub();
    bobHandle = sinon.stub();

    alice = new RpcBridge((msg: any) => bob.handleMessage(msg), aliceHandle);
    bob = new RpcBridge(alice.handleMessage.bind(alice), bobHandle);
  });

  it('can send messages without id', () => {
    alice.send({method: 'foo'}, () => {});
    expect(bobHandle).to.be.calledWith({method: 'foo'});
  });

  it('can send a response to message with id', () => {
    const resp = sinon.fake();
    bobHandle.callsFake((msg, cb) => cb(null, {id: 1, response: 'bar'}));
    alice.send({id: 1, method: 'foo'}, resp);
    expect(bobHandle).to.be.calledWith({id: 1, method: 'foo'});
    expect(resp).to.be.calledWith(null, {id: 1, response: 'bar'});
  });

  it('can not send a response to message twice', () => {
    const resp = sinon.fake();
    bobHandle.callsFake((msg, cb) => {
      cb(null, {id: 1, response: 'bar'});
      cb(null, {id: 1, response: 'baz'});
    });
    alice.send({id: 1, method: 'foo'}, resp);
    expect(bobHandle).to.be.calledWith({id: 1, method: 'foo'});
    expect(resp).to.be.calledWith(null, {id: 1, response: 'bar'});
    expect(resp).to.be.calledOnce;
  });

  it('can respond to a message without an id', () => {
    const resp = sinon.fake();
    bobHandle.callsFake((msg, cb) => cb(null, {id: 1, response: 'bar'}));
    alice.send({method: 'foo'}, resp);
    expect(bobHandle).to.be.calledWith({method: 'foo'});
    expect(resp).to.be.calledWith(null, {id: 1, response: 'bar'});
  });

  it('can respond with an error to a message with id', () => {
    const resp = sinon.fake();
    bobHandle.callsFake((msg, cb) => cb('error'));
    alice.send({id: 1, method: 'foo'}, resp);
    expect(bobHandle).to.be.calledWith({id: 1, method: 'foo'});
    expect(resp).to.be.calledWith('error');
  });

  it('can respond with an error to a message without an id', () => {
    const resp = sinon.fake();
    bobHandle.callsFake((msg, cb) => cb('error'));
    alice.send({method: 'foo'}, resp);
    expect(bobHandle).to.be.calledWith({method: 'foo'});
    expect(resp).to.be.calledWith('error');
  });

  it('filters out junk messages', () => {
    alice.handleMessage({im: 'junk'});
    alice.handleMessage('junk');
    alice.handleMessage(undefined);
    (alice.handleMessage as any)();
    expect(aliceHandle).to.not.be.called;
  });

  it('id collisions are handled appropriately', () => {
    bobHandle.callsFake((msg, cb) => cb(null, {id: 1, response: 'bar'}));
    const resp1 = sinon.fake();
    const resp2 = sinon.fake();
    alice.send({id: 1, method: 'foo'}, resp1);
    expect(resp1).to.be.calledWith(null, {id: 1, response: 'bar'});
    alice.send({id: 1, method: 'foo'}, resp2);
    expect(resp2).to.be.calledWith(null, {id: 1, response: 'bar'});
  });

  it('id collisions are handled appropriately with async callbacks', async () => {
    bobHandle.callsFake((msg, cb) => setTimeout(() => cb(null, {id: 1, response: 'bar'}), 10));
    const resp1 = sinon.fake();
    const resp2 = sinon.fake();
    alice.send({id: 1, method: 'foo'}, resp1);
    alice.send({id: 1, method: 'foo'}, resp2);
    await sleep(20);
    expect(resp1).to.be.calledWith(null, {id: 1, response: 'bar'});
    expect(resp2).to.be.calledWith(null, {id: 1, response: 'bar'});
  });
});
