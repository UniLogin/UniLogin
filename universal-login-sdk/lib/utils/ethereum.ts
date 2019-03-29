import {utils, Contract, providers} from 'ethers';
import ENS from 'universal-login-contracts/build/ENS.json';
import PublicResolver from 'universal-login-contracts/build/PublicResolver.json';

const resolveName = async (
  provider: providers.Provider,
  ensAddress: string,
  ensName: string,
) => {
  const node = utils.namehash(ensName);
  const ensContract = new Contract(ensAddress, ENS.interface, provider);
  const resolverAddress = await ensContract.resolver(node);
  if (resolverAddress !== '0x0000000000000000000000000000000000000000') {
    const resolverContract = new Contract(resolverAddress, PublicResolver.interface, provider);
    return resolverContract.addr(node);
  }
  return false;
};

const codeEqual = (runtimeBytecode: string, liveBytecode: string) => {
  // TODO: verify if it is working
  const compareLength = runtimeBytecode.length - 68;
  return runtimeBytecode.slice(0, compareLength) === liveBytecode.slice(2, compareLength + 2);
};


export {resolveName, codeEqual};
