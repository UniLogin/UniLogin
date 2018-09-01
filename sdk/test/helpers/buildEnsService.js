import ENSBuilder from '../../lib/utils/ensBuilder';
import ENSService from '../../lib/relayer/services/ensService';

const buildEnsService = async (wallet, domain) => {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const provider = await ensBuilder.bootstrapWith(label, tld);
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
