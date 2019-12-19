import Knex from 'knex';
import {Contract, providers, Wallet} from 'ethers';
import {
  ContractJSON,
  deepMerge,
  DeepPartial,
  deployContract,
  ETHER_NATIVE_TOKEN,
  getContractHash,
  withENS,
} from '@universal-login/commons';
import {deployFactory} from '@universal-login/contracts';
import WalletContract from '@universal-login/contracts/contracts/Wallet.json';
import ProxyContract from '@universal-login/contracts/contracts/WalletProxy.json';
import MockToken from '@universal-login/contracts/contracts/MockToken.json';
import {Config} from '../../config/relayer';
import Relayer from './Relayer';
import {getConfig} from '../../core/utils/config';

const ENSBuilder = require('ens-builder');

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

type CreateRelayerArgs = {
  port: string;
  wallet: Wallet;
  walletContract: Contract;
  factoryContract: Contract;
};

export class RelayerUnderTest extends Relayer {
  static async deployBaseContracts(wallet: Wallet) {
    const walletContract = await deployContract(wallet, WalletContract);
    const factoryContract = await deployFactory(wallet, walletContract.address);
    return {walletContract, factoryContract};
  }

  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const {walletContract, factoryContract} = await RelayerUnderTest.deployBaseContracts(wallet);
    return this.createPreconfiguredRelayer({port, wallet, walletContract, factoryContract});
  }

  static async createPreconfiguredRelayer({port, wallet, walletContract, factoryContract}: CreateRelayerArgs) {
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
    const contractWhiteList = getContractWhiteList();
    const mockToken = await deployContract(wallet, MockToken);
    const supportedTokens = [
      {
        address: mockToken.address,
        minimalAmount: '0.05',
      },
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: '0.05',
      },
    ];
    const overrideConfig: DeepPartial<Config> = {
      port,
      privateKey: wallet.privateKey,
      chainSpec: {
        ensAddress: ensBuilder.ens.address,
      },
      ensRegistrars: [DOMAIN],
      walletContractAddress: walletContract.address,
      contractWhiteList,
      factoryAddress: factoryContract.address,
      supportedTokens,
    };
    const relayer = RelayerUnderTest.createTestRelayer(overrideConfig, providerWithENS);
    return {relayer, factoryContract, supportedTokens, contractWhiteList, ensAddress, walletContract, mockToken, provider: providerWithENS};
  }

  static createTestRelayer(overrideConfig: DeepPartial<Config>, providerWithENS: providers.Provider) {
    const config: Config = deepMerge(getConfig('test'), overrideConfig);
    return new RelayerUnderTest(config, providerWithENS);
  }

  url() {
    return `http://127.0.0.1:${this.port}`;
  }

  getConfig() {
    return this.config;
  }

  getServer() {
    return this.server;
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
  await knex.delete().from('devices');
  await knex.delete().from('queue_items');
  await knex.delete().from('signature_key_pairs');
  await knex.delete().from('messages');
  await knex.delete().from('authorisations');
  await knex.delete().from('deployments');
}

export const getContractWhiteList = () => ({
  wallet: [getContractHash(WalletContract as ContractJSON)],
  proxy: [getContractHash(ProxyContract as ContractJSON)],
});
