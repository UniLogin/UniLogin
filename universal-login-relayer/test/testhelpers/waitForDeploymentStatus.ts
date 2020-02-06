import chai, {expect} from 'chai';
import {DeploymentState, DeploymentStatus} from '@universal-login/commons';
import {waitExpect} from '@universal-login/commons/testutils';

export const waitForDeploymentStatus = async (relayerUrl: string, hash: string, expectedState: DeploymentState) => {
  let deploymentStatus: DeploymentStatus;
  await waitExpect(async () => {
    ({body: deploymentStatus} = await chai.request(relayerUrl).get(`/wallet/deploy/${hash}`));
    expect(deploymentStatus.state).to.equal(expectedState);
  });
  return deploymentStatus!;
};
