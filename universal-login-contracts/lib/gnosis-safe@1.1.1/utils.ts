import {utils} from 'ethers';
import {getDeployData} from '@universal-login/commons';
import ProxyContract from './contracts/Proxy.json';

export const computeGnosisCounterfactualAddress = (factoryAddress: string, saltNonce: number, dataCall: string, masterAddress: string) => {
  const initializeData = getDeployData(ProxyContract, [masterAddress])
  const initCodeHash = utils.solidityKeccak256(['bytes'], [initializeData]);
  const dataCallHash = utils.solidityKeccak256(['bytes'], [dataCall]);
  const finalSalt = utils.solidityKeccak256(['bytes32', 'uint256'], [dataCallHash, saltNonce]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', factoryAddress, finalSalt, initCodeHash]);
  return utils.getAddress(`0x${hashedData.slice(26)}`);
};
