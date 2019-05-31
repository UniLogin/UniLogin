import Relayer from '../relayer';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
const ENSBuilder = require('ens-builder');
import {withENS} from '@universal-login/commons';
import {Config} from '../config/relayer';
import {providers, Wallet, ContractFactory} from 'ethers';

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

export class RelayerUnderTest extends Relayer {
  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const { address } = await deployContract(wallet);
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
    const config = {
      port,
      privateKey: wallet.privateKey,
      chainSpec: {
        ensAddress: ensBuilder.ens.address,
        chainId: 0,
      },
      ensRegistrars: [DOMAIN],
      walletMasterAddress: address,
    };
    return new RelayerUnderTest(config as Config, providerWithENS);
  }

  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  async cleanDatabase() {
    await this.database.delete().from('signature_key_pairs');
    await this.database.delete().from('messages');
    await this.database.delete().from('authorisations');
  }
  async stop() {
    await this.cleanDatabase();
    await super.stop();
  }
}

async function deployContract(wallet: Wallet) {
  const factory = new ContractFactory(WalletMaster.abi, WalletMaster.bytecode, wallet);
  return factory.deploy();
}
