import Relayer from '../relayer';
import {defaultAccounts, getWallets} from 'ethereum-waffle';
import ENSBuilder from '../utils/ensBuilder';

class RelayerUnderTest extends Relayer {
  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured(provider) {
    const port = 33111;
    const [deployerWallet] = (await getWallets(provider)).slice(-2);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    const defaultDomain = 'mylogin.eth';
    const ensBuilder = new ENSBuilder(deployerWallet);
    const [label, tld] = defaultDomain.split('.');
    const providerWithENS = await ensBuilder.bootstrapWith(label, tld);
    const config = {
      ...this.config,
      port,
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
