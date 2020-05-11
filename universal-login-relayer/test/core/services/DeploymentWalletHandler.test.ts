import {expect} from 'chai';
import sinon from 'sinon';
import {TEST_CONTRACT_ADDRESS, TEST_DEVICE_INFO, TEST_GAS_PRICE, TEST_TOKEN_ADDRESS, ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY} from '@unilogin/commons';
import DeploymentHandler from '../../../src/core/services/execution/deployment/DeploymentHandler';

describe('UNIT: DeploymentWalletHandler', () => {
  const gasTokenDetails = {gasPrice: TEST_GAS_PRICE, gasToken: TEST_TOKEN_ADDRESS, tokenPriceInETH: '0.001'};
  const deploymentRepository = {add: sinon.spy()};
  const executionQueue = {addDeployment: sinon.spy()};
  const gasTokenValidator = {validate: sinon.spy()};
  const futureWalletStore = {get: sinon.stub()};
  futureWalletStore.get.withArgs(TEST_CONTRACT_ADDRESS).resolves(gasTokenDetails);

  const deploymentHandler = new DeploymentHandler(
    deploymentRepository as any,
    executionQueue as any,
    gasTokenValidator as any,
    futureWalletStore as any,
  );

  it('fails if no future wallet found', async () => {
    const contractAddress = TEST_ACCOUNT_ADDRESS;
    await expect(deploymentHandler.handle(contractAddress, {} as any, TEST_DEVICE_INFO)).rejectedWith('Future wallet not found');
    expect(gasTokenValidator.validate).to.not.called;
    expect(deploymentRepository.add).to.not.called;
    expect(executionQueue.addDeployment).to.not.called;
  });

  it('fails if gas token is different than in future wallet store', async () => {
    const gasToken = ETHER_NATIVE_TOKEN.address;
    await expect(deploymentHandler.handle(TEST_CONTRACT_ADDRESS, {gasPrice: TEST_GAS_PRICE, gasToken} as any, TEST_DEVICE_INFO)).rejectedWith(`Expected gas token equals ${TEST_TOKEN_ADDRESS}, but got ${gasToken}`);
    expect(gasTokenValidator.validate).to.not.called;
    expect(deploymentRepository.add).to.not.called;
    expect(executionQueue.addDeployment).to.not.called;
  });

  it('fails if gas price is different than in future wallet store', async () => {
    const gasPrice = '1987';
    await expect(deploymentHandler.handle(TEST_CONTRACT_ADDRESS, {gasPrice, gasToken: TEST_TOKEN_ADDRESS} as any, TEST_DEVICE_INFO)).rejectedWith(`Expected gas price equals ${TEST_GAS_PRICE}, but got ${gasPrice}`);
    expect(gasTokenValidator.validate).to.not.called;
    expect(deploymentRepository.add).to.not.called;
    expect(executionQueue.addDeployment).to.not.called;
  });

  it('fulfilled', async () => {
    const deployArgs = {
      publicKey: TEST_ACCOUNT_ADDRESS,
      ensName: 'user.unilogin.eth',
      gasPrice: TEST_GAS_PRICE,
      gasToken: TEST_TOKEN_ADDRESS,
      signature: TEST_PRIVATE_KEY,
    };
    await expect(deploymentHandler.handle(TEST_CONTRACT_ADDRESS, deployArgs, TEST_DEVICE_INFO)).to.be.fulfilled;
    expect(gasTokenValidator.validate).to.calledWith(gasTokenDetails);
    expect(deploymentRepository.add).to.calledOnce;
    expect(executionQueue.addDeployment).to.calledOnce;
  });
});
