import Relayer from '../relayer';
import {defaultAccounts, getWallets} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';
import {withENS} from './utils';
import knex from 'knex';
import {getKnexConfig} from './knexUtils';

class RelayerUnderTest extends Relayer {
  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured(provider, knexConfig = getKnexConfig()) {
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
        chainId: 0,
      },
      ensRegistrars: [defaultDomain],
    };
    const database = knex(knexConfig);
    const relayer = new RelayerUnderTest(config, database, providerWithENS);
    relayer.provider = providerWithENS;
    relayer.stop = async () => {
      await relayer.database.delete().from('authorisations');
      await relayer.database.destroy();
      await relayer.server.close();
    };
    await relayer.database.migrate.latest();
    return relayer;
  }
}

export default RelayerUnderTest;
