import Relayer from '../../lib/relayer/relayer';
import {defaultAccounts, getWallets} from 'ethereum-waffle';
import ENSBuilder from '../../lib/utils/ensBuilder';

class RelayerUnderTest extends Relayer {
  static async createPreconfigured(provider) {
    const [deployerWallet] = (await getWallets(provider)).slice(-2);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    const defaultDomain = 'mylogin.eth';
    const ensBuilder = new ENSBuilder(deployerWallet);
    const [label, tld] = defaultDomain.split('.');
    const providerWithENS = await ensBuilder.bootstrapWith(label, tld);
    const config = {
      ...this.config,
      privateKey,
      chainSpec: {
        ensAddress: ensBuilder.ens.address,
        chainId: 0
      },
      ensRegistrars: {
        [defaultDomain]: {
          registrarAddress: ensBuilder.registrars[defaultDomain].address,
          resolverAddress: ensBuilder.resolver.address
        }
      }
    };
    const relayer = new RelayerUnderTest(providerWithENS, config);
    relayer.provider = providerWithENS;
    return relayer;
  }
}

export default RelayerUnderTest;
