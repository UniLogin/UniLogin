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
  TEST_REFUND_PAYER,
} from '@unilogin/commons';
import {beta2, gnosisSafe, deployGnosisSafe, deployProxyFactory, deployDefaultCallbackHandler} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {Config} from '../../config/relayer';
import Relayer from './Relayer';
import {getConfig} from '../../core/utils/config';
import {addRefundPayer} from '../../core/utils/addRefundPayer';

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
  fallbackHandlerContract: Contract;
};

export class RelayerUnderTest extends Relayer {
  static async deployBaseContracts(wallet: Wallet) {
    const walletContract = await deployGnosisSafe(wallet);
    const factoryContract = await deployProxyFactory(wallet);
    const fallbackHandlerContract = await deployDefaultCallbackHandler(wallet);
    const ensRegistrar = await deployContract(wallet, gnosisSafe.ENSRegistrar);
    return {walletContract, factoryContract, ensRegistrar, fallbackHandlerContract};
  }

  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const {walletContract, factoryContract, ensRegistrar, fallbackHandlerContract} = await RelayerUnderTest.deployBaseContracts(wallet);
    return this.createPreconfiguredRelayer({port, wallet, walletContract, factoryContract, ensRegistrar, fallbackHandlerContract});
  }

  static async createPreconfiguredRelayer({port, wallet, walletContract, factoryContract, ensRegistrar, fallbackHandlerContract}: CreateRelayerArgs) {
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
      ensAddress: ensBuilder.ens.address,
      ensRegistrars: [DOMAIN],
      fallbackHandlerAddress: fallbackHandlerContract.address,
      ensRegistrar: ensRegistrar.address,
      walletContractAddress: walletContract.address,
      contractWhiteList,
      factoryAddress: factoryContract.address,
      supportedTokens,
    };
    const relayer = RelayerUnderTest.createTestRelayer(overrideConfig, providerWithENS);
    return {relayer, factoryContract, supportedTokens, contractWhiteList, ensAddress, walletContract, mockToken, provider: providerWithENS, ensRegistrar, fallbackHandlerContract};
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

  async start() {
    await super.start();
    await this.setupTestPartner();
  }

  getServer() {
    return this.server;
  }

  async clearDatabase() {
    return clearDatabase(this.database);
  }

  async setupTestPartner() {
    return addRefundPayer(this, TEST_REFUND_PAYER);
  }

  async stop() {
    await clearDatabase(this.database);
    (this.walletContractService as any).walletVersions = {};
    await super.stopLater();
  }
}

export async function clearDatabase(knex: Knex) {
  await knex('devices').del();
  await knex('future_wallets').del();
  await knex('queue_items').del();
  await knex('signature_key_pairs').del();
  await knex('messages').del();
  await knex('authorisations').del();
  await knex('deployments').del();
  await knex('refund_payers').del();
}

export const getContractWhiteList = () => ({
  wallet: [getContractHash(WalletContract as ContractJSON), getContractHash(gnosisSafe.GnosisSafe)],
  proxy: [getContractHash(WalletProxy as ContractJSON), getContractHash(gnosisSafe.Proxy)],
});
