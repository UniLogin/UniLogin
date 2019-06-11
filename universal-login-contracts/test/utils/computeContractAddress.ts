import {utils} from 'ethers';

export const computeContractAddress = (factoryAddress: string, address: string, salt: Uint8Array, initCode: string) => {
  const finalSalt = utils.solidityKeccak256(['bytes32', 'address'], [salt, address]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [initCode]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', factoryAddress, finalSalt, initCodeHash]);
  return `0x${hashedData.slice(26)}`;
};
