import {utils} from 'ethers';
import {KeyPair} from '@unilogin/commons';
import {encodeInitializeWithENSData} from '../../src';
import {EnsDomainData} from './FutureDeployment';

export function createProxyDeployWithENSArgs(keyPair: KeyPair, ensDomainData: EnsDomainData, walletContractAddress: string, gasPrice: string, gasToken: string, name = 'name') {
  const walletArgs = setupInitializeWithENSArgs({keyPair, ensDomainData, name, gasPrice, gasToken});
  const initData = encodeInitializeWithENSData(walletArgs);
  return [walletContractAddress, initData];
}

type SetupInitializeWithENSArgs = {
  keyPair: KeyPair;
  ensDomainData: EnsDomainData;
  name?: string;
  domain?: string;
  gasPrice: string;
  gasToken: string;
};

export function setupInitializeWithENSArgs({keyPair, ensDomainData, gasPrice, gasToken, name = 'name', domain = 'mylogin.eth'}: SetupInitializeWithENSArgs) {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  const args = [keyPair.publicKey, hashLabel, ensName, node, ensDomainData.ensAddress, ensDomainData.registrarAddress, ensDomainData.resolverAddress, gasPrice, gasToken];
  return args;
}
