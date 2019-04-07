import Relayer from '../relayer';
import {defaultAccounts, getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster';
import ENSBuilder from 'ens-builder';
import {withENS} from './utils';
import {parseDomain} from '@universal-login/commons';

class RelayerUnderTest extends Relayer {
  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured({provider, overridePort} = {provider: createMockProvider(), overridePort: 33111}) {
    const port = overridePort;
    const [deployerWallet] = (await getWallets(provider)).slice(-2);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    const walletMaster = await deployContract(deployerWallet, WalletMaster);
    const defaultDomain = 'mylogin.eth';
    const ensBuilder = new ENSBuilder(deployerWallet);
    const [label, tld] = parseDomain(defaultDomain);
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
      walletMasterAddress: walletMaster.address,
    };
    const relayer = new RelayerUnderTest(config, providerWithENS);
    relayer.provider = providerWithENS;
    relayer.stop = async () => {
      await relayer.database.delete().from('authorisations');
      await relayer.database.destroy();
      await relayer.server.close();
    };
    return relayer;
  }
}

export {RelayerUnderTest};
