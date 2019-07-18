import Knex from 'knex';
import {providers, Wallet, utils, Contract} from 'ethers';
const ENSBuilder = require('ens-builder');
import {withENS, getContractHash, ContractJSON, ETHER_NATIVE_TOKEN, deployContract} from '@universal-login/commons';
import {deployFactory} from '@universal-login/contracts';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {Config} from '../../config/relayer';
import Relayer from './Relayer';
import {localization} from '../../config/localization';

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

type CreateRelayerArgs = {
  port: string;
  wallet: Wallet;
  walletMaster: Contract;
  factoryContract: Contract;
};

export class RelayerUnderTest extends Relayer {
  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const walletMaster = await deployContract(wallet, WalletMasterWithRefund);
    const factoryContract = await deployFactory(wallet, walletMaster.address);
    return this.createPreconfiguredRelayer({port, wallet, walletMaster, factoryContract});
  }

  static async createPreconfiguredRelayer({port, wallet, walletMaster, factoryContract}: CreateRelayerArgs) {
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
    const contractWhiteList = getContractWhiteList();
    const mockToken = await deployContract(wallet, MockToken);
    const supportedTokens = [
      {
        address: mockToken.address,
        minimalAmount: utils.parseEther('0.05').toString()
      },
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: utils.parseEther('0.05').toString()
      }
    ];
    const config: Config = {
      port,
      privateKey: wallet.privateKey,
      chainSpec: {
        name: 'test',
        ensAddress: ensBuilder.ens.address,
        chainId: 0,
      },
      ensRegistrars: [DOMAIN],
      walletMasterAddress: walletMaster.address,
      contractWhiteList,
      factoryAddress: factoryContract.address,
      supportedTokens,
      localization
    };
    const relayer = new RelayerUnderTest(config, providerWithENS);
    return {relayer, factoryContract, supportedTokens, contractWhiteList, ensAddress, walletMaster, mockToken, provider: providerWithENS};
  }

  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  async clearDatabase() {
    return clearDatabase(this.database);
  }

  async stop() {
    await clearDatabase(this.database);
    await super.stopLater();
  }
}

export async function clearDatabase(knex: Knex) {
  await knex.delete().from('queue_items');
  await knex.delete().from('signature_key_pairs');
  await knex.delete().from('messages');
  await knex.delete().from('authorisations');
}

export const getContractWhiteList = () => ({
  master: [],
  proxy: [getContractHash(ProxyContract as ContractJSON)]
});
