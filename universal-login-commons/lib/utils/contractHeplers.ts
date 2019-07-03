import {utils} from 'ethers';
import {ContractJSON} from '../core/types/ContractJSON';
import {ensure} from '../core/handleError';

export const getDeployedBytecode = (contract: ContractJSON) => contract.evm.deployedBytecode.object;

export const getContractHash = (contract: ContractJSON) => utils.keccak256(`0x${getDeployedBytecode(contract)}`);

export const isContractExist = (bytecode: string) => {
  ensure(bytecode.length > 0, Error, 'Empty bytecode');
  return bytecode !== '0x';
};

export default getContractHash;
