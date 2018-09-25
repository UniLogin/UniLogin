import ENSBuilder from 'ens-builder';
import ENSService from '../../lib/services/ensService';
import {withENS} from '../../lib/utils/utils';

const buildEnsService = async (wallet, domain) => {
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
  const ensService = new ENSService(ensBuilder.ens.address, ensRegistrars);
  return [ensService, provider, ensBuilder];
};

export default buildEnsService;
