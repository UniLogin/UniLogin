import {WalletDeploymentService} from '../../../src/integration/ethereum/WalletDeploymentService';
import {startRelayer} from '../../testhelpers/http';
import setupMessageService from '../../testhelpers/setupMessageService';
import getKnexConfig from '../../testhelpers/knex';

describe('INT: Deployment Executor', () => {

  before(async () => {
    const {relayer} = await startRelayer();
    const {} = setupMessageService(relayer.database, relayer.getConfig());
  });

  let deployment = {
    publicKey: '',
    ensName: '',
    gasPrice: '',
    gasToken: '',
    signature: '',
  }
  let deploymentRepository = {
    get: (deploymnetHash: string) => deployment,
    markAsPending: (hash: string, transactionHash: string, usedGasPrice: string) => {},
    markAsError: (hash: string, error: string) => {},
    markAsSuccess: (hash: string, gasUsed: string) => {},
  }
  let walletService: WalletDeploymentService;

  it('should mark state as error if there is no gasUsed', () => {

  });

  it('should mark state as success if there is gasUsed', () => {

  });

  after(async () => {

  });
});