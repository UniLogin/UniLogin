import {DevelopmentRelayer} from '../dev';
import {defaultAccounts, getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';
import {withENS} from './utils';
import MockToken from 'universal-login-contracts/build/MockToken';


class RelayerUnderTest extends DevelopmentRelayer {
  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  static async createPreconfigured({provider = createMockProvider(), overridePort = 33111, tokenContractAddress = undefined} = {}) {
    const port = overridePort;
    const [, , deployerWallet, tokenWallet, etherWallet] = await getWallets(provider);
    const privateKey = defaultAccounts.slice(-1)[0].secretKey;
    let tokenAddress = tokenContractAddress;
    if (!tokenContractAddress) {
      const mockToken = await deployContract(tokenWallet, MockToken);
      tokenAddress = mockToken.address;
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
      tokenContractAddress: tokenAddress,
      tokenPrivateKey: tokenWallet.privateKey,
      etherPrivateKey: etherWallet.privateKey
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
