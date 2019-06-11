import {utils} from 'ethers';

export const computeContractAddress = (factoryAddress: string, address: string, salt: Uint8Array, initCode: any) => {
  const finalSalt = utils.solidityKeccak256(['address', 'bytes32'], [address, salt]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [initCode]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', factoryAddress, finalSalt, initCodeHash]);
  return hashedData.slice(0, 42);
};
