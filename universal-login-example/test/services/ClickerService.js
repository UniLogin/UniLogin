import chai, {expect} from 'chai';
import ClickerService from '../../src/services/ClickerService';
import EnsService from '../../src/services/EnsService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicEnviroment from '../fixtures/basicEnvironment';

chai.use(sinonChai)

describe('ClickerService', async () => {
  const testHelper = new TestHelper();
  let clickerService;
  let identityService;
  let provider;
  let clickerContract;
  let ensService;
  let tokenContract;
  let defaultPaymentOptions;
  let wallet;
  let relayer;
  let sdk;

  beforeEach(async () => {
    ({wallet, provider, relayer, clickerContract, tokenContract, sdk} = await testHelper.load(basicEnviroment));
    identityService = {
      identity: {
        name: 'kyle'
      }
    };
    ensService = new EnsService(sdk, provider);
    clickerService = new ClickerService(identityService, clickerContract.address, provider, ensService, tokenContract.address, defaultPaymentOptions);
  });

  it('getPressLogs', async () => {
    await clickerContract.press();
    const [logs] = await clickerService.getPressLogs();
    expect(logs).to.deep.include({
      address: clickerContract.address
    });
  });

  it('getPressEvents', async () => {
    await clickerContract.press();
    clickerService.getTimeDistanceInWords = sinon.fake.returns('6 minutes');
    clickerService.getEnsName = sinon.fake.returns('kyle.mylogin.eth');
    const [logs] = await clickerService.getPressEvents();
    expect(logs).to.deep.include({
      name: 'kyle.mylogin.eth',
      address: wallet.address
    });
  });

  it('getEventFromLogs', async () => {
    const logs = {
      data: '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff000000000000000000000000000000000000000000000000000000005c126bc40000000000000000000000000000000000000000000000000000000000000000',
      topics: ['0xed4ecf2dfe76f67b96ed1cee5b13992932ce8400770a51bc2a435e724602d5f6']
    };
    clickerService.getTimeDistanceInWords = sinon.fake.returns('6 minutes');
    clickerService.getEnsName = sinon.fake.returns('kyle.mylogin.eth');
    const event = await clickerService.getEventFormLogs(logs);
    expect(event).to.deep.eq({
      address: '0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff',
      pressTime: '6 minutes',
      name: 'kyle.mylogin.eth',
      score: 0,
      key: '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff000000000000000000000000000000000000000000000000000000005c126bc40000000000000000000000000000000000000000000000000000000000000000'
    });
  });

  it('subscribe', async () => {
    const callback = sinon.spy();
    clickerService.subscribe(callback);
    await clickerContract.press();
    expect(callback).to.have.been.called;
    clickerService.unsubscribeAll();
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
