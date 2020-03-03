import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {TEST_TRANSACTION_HASH, INITIAL_GAS_PARAMETERS} from '@unilogin/commons';
import {BackupCodesService} from '../../../src/core/services/BackupCodesService';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('UNIT: BackupCodesService', () => {
  const waitToBeSuccess = sinon.stub().resolves(['350', '506', '372', '483', '576', '48']);
  const waitForTransactionHash = sinon.stub().resolves(TEST_TRANSACTION_HASH);
  const deployedWallet = {
    generateBackupCodes: sinon.stub().resolves({
      waitToBeSuccess,
      waitForTransactionHash,
    }),
  };
  let backupCodesService: BackupCodesService;

  before(() => {
    sinon.replace(console, 'error', () => {});
  });

  beforeEach(() => {
    backupCodesService = new BackupCodesService(deployedWallet as any);
  });

  it('initial state', () => {
    expect(backupCodesService.state.get()).to.deep.eq({kind: 'Initial'});
  });

  describe('generate', () => {
    it('failure state if gasParameters undefined', async () => {
      await backupCodesService.generate(undefined);
      expect(backupCodesService.state.get()).to.deep.eq({
        kind: 'Failure',
        error: 'Missing parameter: gas parameters',
      });
    });

    it('successful call', async () => {
      await backupCodesService.generate(INITIAL_GAS_PARAMETERS);
      expect(backupCodesService.state.get()).to.deep.eq({
        kind: 'Generated',
        codes: ['350', '506', '372', '483', '576', '48'],
      });
      expect(deployedWallet.generateBackupCodes).calledWithExactly(INITIAL_GAS_PARAMETERS);
      expect(deployedWallet.generateBackupCodes).calledBefore(waitForTransactionHash);
      expect(waitForTransactionHash).calledBefore(waitToBeSuccess);
    });
  });

  afterEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });
});
