import Relayer from '../relayer';
import {defaultAccounts, getWallets} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';
import {withENS} from './utils';
import knex from 'knex';
import knexConfig from '../../knexfile';

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
    const ensAddress = await ensBuilder.bootstrapWith(label, tld);
    const providerWithENS = withENS(provider, ensAddress);
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
    const database = knex(knexConfig.test);
    const relayer = new RelayerUnderTest(config, providerWithENS, database);
    relayer.provider = providerWithENS;
    return relayer;
  }
}

export default RelayerUnderTest;
