import PublicResolver from '../../build/PublicResolver.json';
import {Provider} from 'ethers/providers';
import {namehash} from 'ethers/utils';
import {Contract} from 'ethers';

export const lookupAddress = async (provider: Provider, address: string, resolverAddress: string) => {
  const node = namehash(`${address.slice(2)}.addr.reverse`);
  const contract = new Contract(resolverAddress, PublicResolver.abi, provider);
  return contract.name(node);
};
