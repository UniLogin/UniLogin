import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import {encodeDataForSetup, INITIAL_REQUIRED_CONFIRMATIONS} from '@universal-login/contracts';
import {ENSService} from '../../integration/ethereum/ENSService';

export const setupInitData = async (publicKey: string, ensName: string, gasPrice: string, gasToken: string, ensService: ENSService, relayerAddress: string) => {
  const ensRegistrarData = await ensService.getRegistrarData(ensName);
  const deployment = {
    owners: [publicKey],
    requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
    deploymentCallAddress: ensService.ensRegistrarAddress,
    deploymentCallData: ensRegistrarData,
    fallbackHandler: AddressZero,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: relayerAddress,
  };
  return encodeDataForSetup(deployment);
};
