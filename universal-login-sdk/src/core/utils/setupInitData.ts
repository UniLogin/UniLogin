import {utils} from 'ethers';
import {DEPLOY_GAS_LIMIT} from '@unilogin/commons';
import {encodeDataForSetup, INITIAL_REQUIRED_CONFIRMATIONS} from '@unilogin/contracts';
import {ENSService} from '../../integration/ethereum/ENSService';

type InitDataParameters = {
  publicKey: string;
  ensName: string;
  gasPrice: string;
  gasToken: string;
  ensService: ENSService;
  relayerAddress: string;
  fallbackHandler: string;
};

export const setupInitData = async ({publicKey, ensName, gasPrice, gasToken, ensService, relayerAddress, fallbackHandler}: InitDataParameters) => {
  const ensRegistrarData = await ensService.getRegistrarData(ensName);
  const deployment = {
    owners: [publicKey],
    requiredConfirmations: INITIAL_REQUIRED_CONFIRMATIONS,
    deploymentCallAddress: ensService.ensRegistrarAddress,
    deploymentCallData: ensRegistrarData,
    fallbackHandler,
    paymentToken: gasToken,
    payment: utils.bigNumberify(gasPrice).mul(DEPLOY_GAS_LIMIT).toString(),
    refundReceiver: relayerAddress,
  };
  return encodeDataForSetup(deployment);
};
