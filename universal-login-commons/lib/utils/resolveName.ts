import {utils, Contract, providers} from 'ethers';
import ENS from '../contracts/ENS.json';
import PublicResolver from '../contracts/PublicResolver.json';


export const resolveName = async (
  provider: providers.Provider,
  ensAddress: string,
  ensName: string,
) => {
  const node = utils.namehash(ensName);
  console.log('node');
  const ensContract = new Contract(ensAddress, ENS.interface, provider);
  console.log('enscontract')
  const resolverAddress = await ensContract.resolver(node);
  console.log({resolverAddress});
  if (resolverAddress !== '0x0000000000000000000000000000000000000000') {
    const resolverContract = new Contract(resolverAddress, PublicResolver.interface, provider);
    console.log(resolverContract)
    return resolverContract.addr(node);
  }
  console.log('return false');
  return false;
};
