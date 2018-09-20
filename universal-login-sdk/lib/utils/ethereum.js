import ethers, {utils} from 'ethers';
import ENS from '../../abi/ENS';
import PublicResolver from '../../abi/PublicResolver';

const resolveName = async (provider, ensAddress, ensName) => {
  const node = utils.namehash(ensName);
  const ensContract = new ethers.Contract(ensAddress, ENS.interface, provider);
  const resolverAddress = await ensContract.resolver(node);
  if (resolverAddress !== '0x0000000000000000000000000000000000000000') {
    const resolverContract = new ethers.Contract(resolverAddress, PublicResolver.interface, provider);
    return await resolverContract.addr(node);
  }
  return false;
};

const codeEqual = (runtimeBytecode, liveBytecode) => {
  // TODO: verify if it is working
  const compareLength = runtimeBytecode.length - 68;
  return runtimeBytecode.slice(0, compareLength) === liveBytecode.slice(2, compareLength + 2);
};


export {resolveName, codeEqual};
