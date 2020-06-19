import {Wallet, providers} from 'ethers';
const ENSBuilder = require('ens-builder');
import {MockProvider} from 'ethereum-waffle';
import {withENS} from '../../src/integration/ethereum/ens';

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
  const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
  return {
    wallet,
    ensRegistrars: [domain],
    provider,
    providerWithENS,
    ensBuilder,
    ensAddress,
    publicResolver: resolverAddress,
    registrarAddress,
  };
}
