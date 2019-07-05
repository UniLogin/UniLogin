import ENSBuilder from 'ens-builder';
import ENSService from '../../lib/integration/ethereum/ensService';
import {withENS} from '@universal-login/commons';

const buildEnsService = async (wallet, domain) => {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const provider = withENS(wallet.provider, ensAddress);
  const ensRegistrars = [domain];
  const ensService = new ENSService(ensBuilder.ens.address, ensRegistrars, provider);
  await ensService.start();
  return [ensService, provider, ensBuilder];
};

export default buildEnsService;
