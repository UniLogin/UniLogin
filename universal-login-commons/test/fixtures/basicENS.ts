import {providers, Wallet} from 'ethers';
const ENSBuilder = require('ens-builder');
import {withENS} from '../../lib/utils/withENS';

export async function basicENS(provider: providers.Provider, [wallet]: Wallet[]) {
  const domain = 'mylogin.eth';
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
  const ensRegistrars = [domain];
  return {wallet, ensRegistrars, provider: providerWithENS, ensBuilder, ensAddress, publicResolver: ensBuilder.resolver.address};
}
