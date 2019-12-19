import {utils} from 'ethers';
import {getDeployData} from '@universal-login/commons';
import ProxyContract from './contracts/Proxy.json';

export const computeGnosisCounterfactualAddress = (proxyFactoryAddress: string, saltNonce: number, initializeData: string, gnosisSafeAddress: string) => {
  const deployData = getDeployData(ProxyContract, [gnosisSafeAddress]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [deployData]);
  const dataCallHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  const finalSalt = utils.solidityKeccak256(['bytes32', 'uint256'], [dataCallHash, saltNonce]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', proxyFactoryAddress, finalSalt, initCodeHash]);
  return utils.getAddress(`0x${hashedData.slice(26)}`);
};
