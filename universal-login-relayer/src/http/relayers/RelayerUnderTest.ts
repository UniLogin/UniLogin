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
} from '@unilogin/commons';
import {beta2, gnosisSafe, deployGnosisSafe, deployProxyFactory} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {Config} from '../../config/relayer';
import Relayer from './Relayer';
import {getConfig} from '../../core/utils/config';

const ENSBuilder = require('ens-builder');
const {WalletContract, WalletProxy} = beta2;

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

type CreateRelayerArgs = {
  port: string;
  wallet: Wallet;
  walletContract: Contract;
  factoryContract: Contract;
  ensRegistrar: Contract;
};

export class RelayerUnderTest extends Relayer {
  static async deployBaseContracts(wallet: Wallet) {
    const walletContract = await deployGnosisSafe(wallet);
    const factoryContract = await deployProxyFactory(wallet);
    const ensRegistrar = await deployContract(wallet, gnosisSafe.ENSRegistrar);
    return {walletContract, factoryContract, ensRegistrar};
  }

  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const {walletContract, factoryContract, ensRegistrar} = await RelayerUnderTest.deployBaseContracts(wallet);
    return this.createPreconfiguredRelayer({port, wallet, walletContract, factoryContract, ensRegistrar});
  }

  static async createPreconfiguredRelayer({port, wallet, walletContract, factoryContract, ensRegistrar}: CreateRelayerArgs) {
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
    const contractWhiteList = getContractWhiteList();
    const mockToken = await deployContract(wallet, mockContracts.MockToken);
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
      ensRegistrar: ensRegistrar.address,
      walletContractAddress: walletContract.address,
      contractWhiteList,
      factoryAddress: factoryContract.address,
      supportedTokens,
    };
    const relayer = RelayerUnderTest.createTestRelayer(overrideConfig, providerWithENS);
    return {relayer, factoryContract, supportedTokens, contractWhiteList, ensAddress, walletContract, mockToken, provider: providerWithENS, ensRegistrar};
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
    (this.walletContractService as any).walletVersions = {};
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
  wallet: [getContractHash(WalletContract as ContractJSON), getContractHash(gnosisSafe.GnosisSafe)],
  proxy: [getContractHash(WalletProxy as ContractJSON), getContractHash(gnosisSafe.Proxy)],
});
