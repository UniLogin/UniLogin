import {utils} from 'ethers';

export const computeCounterfactualAddress = (factoryAddress: string, publicKey: string, initCode: string) => {
  const finalSalt = utils.solidityKeccak256(['address'], [publicKey]);
  const initCodeHash = utils.solidityKeccak256(['bytes'], [initCode]);
  const hashedData = utils.solidityKeccak256(['bytes1', 'address', 'bytes32', 'bytes32'], ['0xff', factoryAddress, finalSalt, initCodeHash]);
  return utils.getAddress(`0x${hashedData.slice(26)}`);
};

export const computeContractAddress = (address: string, nonce: number) => {
  const futureAddress = utils.keccak256(utils.RLP.encode([address, utils.stripZeros(utils.hexlify(nonce))]));
  return utils.getAddress(`0x${futureAddress.slice(26)}`);
};
