import {utils, Contract, providers} from 'ethers';
import ENS from '../../contracts/ENS.json';
import PublicResolver from '../../contracts/PublicResolver.json';


export const resolveName = async (
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
