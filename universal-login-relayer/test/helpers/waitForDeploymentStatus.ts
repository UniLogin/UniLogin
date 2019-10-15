import {DeploymentState, DeploymentStatus, waitExpect} from '@universal-login/commons';
import chai, {expect} from 'chai';

export const waitForDeploymentStatus = async (relayerUrl: string, hash: string, expectedState: DeploymentState) => {
  let deploymentStatus: DeploymentStatus;
  await waitExpect(async () => {
    ({body: deploymentStatus} = await chai.request(relayerUrl).get(`/wallet/deploy/${hash}`));
    expect(deploymentStatus.state).to.be.equal(expectedState);
  });
  return deploymentStatus!;
};
