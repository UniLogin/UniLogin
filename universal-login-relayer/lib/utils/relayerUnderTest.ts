import Relayer from '../relayer';
import {defaultAccounts, getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
const ENSBuilder = require('ens-builder');
import {withENS} from './utils';
import {parseDomain} from '@universal-login/commons';
import {Config} from '@universal-login/commons';
import {providers} from 'ethers';

interface Overrides {
  overridePort?: string;
  provider: providers.Provider;
}

class RelayerUnderTest extends Relayer {


  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured({provider, overridePort}: Overrides = {provider: createMockProvider(), overridePort: '33111'}) {
    const port = overridePort;
    const [deployerWallet] = (await getWallets(provider)).slice(-2);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    const walletMaster = await deployContract(deployerWallet, WalletMaster);
    const defaultDomain = 'mylogin.eth';
    const ensBuilder = new ENSBuilder(deployerWallet);
    const [label, tld] = parseDomain(defaultDomain);
    const ensAddress = await ensBuilder.bootstrapWith(label, tld);
    const providerWithENS = withENS(provider as providers.Web3Provider, ensAddress);
    const config = {
      port,
      privateKey,
      chainSpec: {
        ensAddress: ensBuilder.ens.address,
        chainId: 0,
      },
      ensRegistrars: [defaultDomain],
      walletMasterAddress: walletMaster.address,
      legacyENS: false,
    };
    const relayer = new RelayerUnderTest(config as Config, providerWithENS);
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
