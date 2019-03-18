import {DevelopmentRelayer} from '../dev';
import {defaultAccounts, getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';
import {withENS} from './utils';
import {Wallet} from 'ethers';
import MockToken from 'universal-login-contracts/build/MockToken';


class RelayerUnderTest extends DevelopmentRelayer {
  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured({provider = createMockProvider(), overridePort = 33111, tokenContractAddress = undefined} = {}) {
    const port = overridePort;
    const [deployerWallet] = (await getWallets(provider)).slice(-2);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    const relayerWallet = new Wallet(privateKey, provider);
    if (!tokenContractAddress) {
      const mockToken = await deployContract(relayerWallet, MockToken);
      tokenContractAddress = mockToken.address;
    }
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
      tokenContractAddress
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
