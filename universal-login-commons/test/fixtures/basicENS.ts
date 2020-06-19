import {Wallet} from 'ethers';
const ENSBuilder = require('ens-builder');
import {MockProvider} from 'ethereum-waffle';

export async function deployENS(wallet: Wallet, domain = 'mylogin.eth') {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const resolverAddress = ensBuilder.resolver.address;
  const registrarAddress = ensBuilder.registrars[domain].address;
  return {ensAddress, resolverAddress, registrarAddress, ensBuilder};
}

export async function basicENS(provider: MockProvider, [wallet]: Wallet[]) {
  const domain = 'mylogin.eth';
  const {ensAddress, resolverAddress, ensBuilder, registrarAddress} = await deployENS(wallet, domain);
  return {
    wallet,
    ensRegistrars: [domain],
    provider,
    ensBuilder,
    ensAddress,
    publicResolver: resolverAddress,
    registrarAddress,
  };
}
