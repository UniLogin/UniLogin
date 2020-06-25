import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {TEST_ACCOUNT_ADDRESS, waitUntil, Erc721TokensService, IBasicToken, IErc721Token} from '@unilogin/commons';
import {Erc721TokensObserver} from '../../../src/core/observers/Erc721TokensObserver';

chai.use(sinonChai);

describe('INT: Erc721TokensObserver', () => {
  let erc721TokensService: Erc721TokensService;
  let erc721TokensObserver: Erc721TokensObserver;
  let mockedTokens: IBasicToken[];
  let detailedMockedTokens: IErc721Token[];

  beforeEach(async () => {
    mockedTokens = [
      {
        tokenID: '1',
        contractAddress: '0x1',
      },
      {
        tokenID: '2',
        contractAddress: '0x2',
      },
    ];

    detailedMockedTokens = [
      {
        id: '1',
        name: 'firstMockedToken',
        image: 'url',
        description: 'desc',
        backgroundColor: '000000',
        tokenName: 'mockedToken',
        externalink: 'url2',
      },
      {
        id: '2',
        name: 'secondMockedToken',
        image: 'url',
        description: 'desc',
        backgroundColor: '000000',
        tokenName: 'mockedToken',
        externalink: 'url2',
      },
    ];

    erc721TokensService = {
      getTokensForAddress: () => mockedTokens,
      getTokensDetails: () => detailedMockedTokens,
    } as any;
    erc721TokensObserver = new Erc721TokensObserver(TEST_ACCOUNT_ADDRESS, erc721TokensService, 100);
  });

  it('1 subscription - no change', async () => {
    const callback = sinon.spy();

    const unsubscribe = erc721TokensObserver.subscribe(callback);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();

    expect(callback).to.have.been.calledOnce;
    expect(callback.firstCall.args[0] as IBasicToken[]).to.deep.eq(detailedMockedTokens);
  });

  it('1 subscription - tokens changed', async () => {
    const callback = sinon.spy();
    const newMockedToken = {tokenID: '3', contractAddress: '0x3'};

    const unsubscribe = erc721TokensObserver.subscribe(callback);
    await waitUntil(() => !!callback.firstCall);
    mockedTokens.push(newMockedToken);
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();

    expect(callback).to.have.been.calledTwice;
    expect(callback.secondCall.args[0] as IBasicToken[]).to.deep.eq(detailedMockedTokens);
  });

  it('2 subscription - no change', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = erc721TokensObserver.subscribe(callback1);
    const unsubscribe2 = erc721TokensObserver.subscribe(callback2);

    await waitUntil(() => !!callback1.firstCall);
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();
    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;
    expect(callback1.firstCall.args[0] as IBasicToken[]).to.deep.eq(detailedMockedTokens);
    expect(callback2.firstCall.args[0] as IBasicToken[]).to.deep.eq(detailedMockedTokens);
  });

  it('2 subscription - tokens changed', async () => {
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();
    const newDetailedMockedToken = {
      id: '3',
      name: 'thirdMockedToken',
      image: 'url',
      description: 'desc',
      backgroundColor: '000000',
      tokenName: 'mockedToken',
      externalink: 'url2',
    };
    const expectedTokens = detailedMockedTokens.concat(newDetailedMockedToken);

    const unsubscribe1 = erc721TokensObserver.subscribe(callback1);
    const unsubscribe2 = erc721TokensObserver.subscribe(callback2);

    detailedMockedTokens.push(newDetailedMockedToken);

    await waitUntil(() => !!callback1.firstCall);
    await waitUntil(() => !!callback2.firstCall);

    unsubscribe1();
    unsubscribe2();

    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;
    expect(callback1.firstCall.args[0] as IBasicToken[]).to.deep.eq(expectedTokens);
    expect(callback2.firstCall.args[0] as IBasicToken[]).to.deep.eq(expectedTokens);
  });

  afterEach(async () => {
    await erc721TokensObserver.stop();
  });
});
