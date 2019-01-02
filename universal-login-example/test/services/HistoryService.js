import chai, {expect} from 'chai';
import HistoryService from '../../src/services/HistoryService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicEnviroment from '../fixtures/basicEnvironment';
import setupSdk from '../fixtures/setupSdk';


chai.use(sinonChai);

describe('HistoryService', async () => {
  let testHelper;
  let historyService;
  let provider;
  let clickerContract;
  let wallet;
  let relayer;

  beforeEach(async () => {
    ({relayer, provider} = await setupSdk());
    testHelper = new TestHelper(provider);
    ({wallet, clickerContract} = await testHelper.load(basicEnviroment));
    historyService = new HistoryService(clickerContract.address, provider);
  });

  it('getPressLogs', async () => {
    await clickerContract.press();
    const [logs] = await historyService.getPressLogs();
    expect(logs).to.deep.include({
      address: clickerContract.address
    });
  });

  it('getPressEvents', async () => {
    await clickerContract.press();
    await historyService.getPressEvents();
    const [logs] = historyService.pressers;
    expect(logs).to.deep.include({
      name: wallet.address,
      address: wallet.address
    });
  });

  it('getEventFromLogs', async () => {
    const logs = {
      data: '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff000000000000000000000000000000000000000000000000000000005c126bc40000000000000000000000000000000000000000000000000000000000000000',
      topics: ['0xed4ecf2dfe76f67b96ed1cee5b13992932ce8400770a51bc2a435e724602d5f6']
    };
    historyService.getTimeDistanceInWords = sinon.fake.returns('6 minutes');
    const event = await historyService.getEventFormLogs(logs);
    expect(event).to.deep.eq({
      address: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
      pressTime: '6 minutes',
      name: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
      score: 0,
      key: '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff000000000000000000000000000000000000000000000000000000005c126bc40000000000000000000000000000000000000000000000000000000000000000'
    });
  });

  it('subscribe', async () => {
    const callback = sinon.spy();
    historyService.subscribe(callback, 0);
    await clickerContract.press();
    expect(callback).to.have.been.calledWith({
      events: [],
      lastClick: '0',
      loaded: true
    });
    historyService.unsubscribeAll();
  });

  it('calculateResult', async () => {
    await clickerContract.press();
    const result = await historyService.calculateResult();
    expect(result.events[0]).to.deep.include({
      address: '0x121199e18C70ac458958E8eB0BC97c0Ba0A36979'
    });
    expect(result.loaded).to.eq(true);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
