import {utils} from 'ethers';
import {ContractJSON} from '../types/ContractJSON';

export const getDeployedBytecode = (contract: ContractJSON) => contract.evm.deployedBytecode.object;

export const getContractHash = (contract: ContractJSON) => utils.keccak256(`0x${getDeployedBytecode(contract)}`);

export default getContractHash;
