import chai, {expect} from 'chai';
import {DeploymentState, DeploymentStatus} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';

export const waitForDeploymentStatus = async (relayerUrl: string, hash: string, expectedState: DeploymentState) => {
  let deploymentStatus: DeploymentStatus;
  await waitExpect(async () => {
    ({body: deploymentStatus} = await chai.request(relayerUrl).get(`/wallet/deploy/${hash}`));
    expect(deploymentStatus.state).to.eq(expectedState, deploymentStatus.error?.toString());
  });
  return deploymentStatus!;
};
