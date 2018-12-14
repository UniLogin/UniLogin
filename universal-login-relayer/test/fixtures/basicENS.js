import ENSBuilder from 'ens-builder';
import {withENS} from '../../lib/utils/utils';

export default async function basicENS(wallet) {
  const domain = 'mylogin.eth';
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const provider = withENS(wallet.provider, ensAddress);
  const ensRegistrars = {
    [domain]: {
      registrarAddress: ensBuilder.registrars[domain].address,
      resolverAddress: ensBuilder.resolver.address
    }
  };
 
  return {wallet, ensRegistrars, provider, ensBuilder, ensAddress, publicResolver: ensBuilder.resolver.address};
}
