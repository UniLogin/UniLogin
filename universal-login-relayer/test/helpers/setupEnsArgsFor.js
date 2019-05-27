import ENSBuilder from 'ens-builder';
import {ensArgs} from '../../lib/services/EnsArgs';
import {withENS} from '@universal-login/commons';

const setupEnsArgsFor = async (wallet, domain) => {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const provider = withENS(wallet.provider, ensAddress);
  const ensRegistrars = [domain];
  const ensArgsFor = ensArgs(ensBuilder.ens.address, ensRegistrars);
  return [ensArgsFor, provider, ensBuilder];
};

export default setupEnsArgsFor;
