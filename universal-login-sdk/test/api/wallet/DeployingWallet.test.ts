import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {DeployingWallet} from '../../../src/api/wallet/DeployingWallet';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_MESSAGE_HASH, TEST_TRANSACTION_HASH, ensure} from '@unilogin/commons';
import {SerializedDeployingWallet, DeployedWallet} from '../../../src';
import {Wallet} from 'ethers';

chai.use(sinonChai);

describe('UNIT: DeployingWallet', () => {
  const serializedDeployingWallet: SerializedDeployingWallet = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploymentHash: TEST_MESSAGE_HASH,
    email: 'name@gmail.com',
  };
  const deploymentStatusWithoutHash = {
    deploymentHash: TEST_MESSAGE_HASH,
    error: null,
    transactionHash: null,
    state: 'Queued',
  };
  const pendingStatus = {
    ...deploymentStatusWithoutHash,
    transactionHash: TEST_TRANSACTION_HASH,
    state: 'Pending'};

  const successStatus = {...pendingStatus, state: 'Success'};
  const getStatus = sinon.stub()
    .onFirstCall().resolves(deploymentStatusWithoutHash)
    .onSecondCall().resolves(pendingStatus)
    .resolves(successStatus);
  let deployingWallet: DeployingWallet;
  const sdk = {
    provider: Wallet.createRandom(),
    relayerApi: {
      getDeploymentStatus: getStatus,
    },
    config: {
      mineableFactoryTick: 10,
      mineableFactoryTimeout: 100,
    },
  } as any;

  beforeEach(() => {
    deployingWallet = new DeployingWallet(serializedDeployingWallet, sdk);
  });

  it('waits for transaction hash', async () => {
    expect(await deployingWallet.waitForTransactionHash()).to.deep.eq(pendingStatus);
  });

  it('waits to be success', async () => {
    const deployedWallet = await deployingWallet.waitToBeSuccess();
    const {deploymentHash, ...serializedDeployedWallet} = serializedDeployingWallet;
    ensure(deployedWallet instanceof DeployedWallet, Error, 'variable should be instance of DeplloyedWallet');
    expect(deployedWallet.asSerializedDeployedWallet).to.deep.eq(serializedDeployedWallet);
  });
});
