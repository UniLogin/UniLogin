import setupWalletService, {createFutureWalletUsingEnsService} from '../../testhelpers/setupWalletService';
import {createKeyPair, ETHER_NATIVE_TOKEN, KeyPair, DeployArgs} from '@unilogin/commons';
import sinon from 'sinon';
import DeploymentExecutor from '../../../src/integration/ethereum/DeploymentExecutor';
import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import SQLRepository from '../../../src/integration/sql/services/SQLRepository';
import Deployment from '../../../src/core/models/Deployment';

describe('INT: Deployment Executor', () => {
  let keyPair: KeyPair;
  const ensName = 'login.mylogin.eth';
  let signature;
  let deployment: DeployArgs;
  let deploymentExecutor: DeploymentExecutor;
  let deploymentRepository: SQLRepository<Deployment>;
  let contractAddress: string;
  let wallet: Wallet;

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets();
    const {walletService, gnosisSafeMaster, factoryContract, ensRegistrar, ensService, fallbackHandler} = await setupWalletService(wallet);
    keyPair = createKeyPair();
    ({signature, contractAddress} = await createFutureWalletUsingEnsService(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar.address, gnosisSafeMaster.address, fallbackHandler.address, '1'));
    deployment = {
      publicKey: keyPair.publicKey,
      ensName,
      gasPrice: '1',
      gasToken: ETHER_NATIVE_TOKEN.address,
      signature,
    };

    deploymentRepository = {
      get: (deploymentHash: string) => deployment,
      markAsPending: sinon.spy(),
      markAsError: sinon.spy(),
      markAsSuccess: sinon.spy(),
    } as any;

    deploymentExecutor = new DeploymentExecutor(deploymentRepository as any, walletService);
  });

  it('should mark state as error if there is no gasUsed', async () => {
    const failedTransactionResponse = {
      wait: () => (
        {
          status: 0,
        }),
      hash: '0x123',
      gasPrice: '1',
    };
    (deploymentExecutor.execute as any) = () => failedTransactionResponse;
    await deploymentExecutor.handleExecute('');
    expect(deploymentRepository.markAsError).to.be.calledOnceWith('', 'Error: Gas used not found in transaction receipt');
  });

  it('should mark state as success if there is gasUsed', async () => {
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1')});
    await deploymentExecutor.handleExecute('');
    expect(deploymentRepository.markAsSuccess).to.be.calledOnce;
  });
});
