import Knex from 'knex';
import {Contract, providers, Wallet} from 'ethers';
import {
  ContractJSON,
  DeepPartial,
  deployContract,
  ETHER_NATIVE_TOKEN,
  getContractHash,
  withENS,
  TEST_REFUND_PAYER,
  TEST_TOKEN_DETAILS,
  TEST_TOKEN_PRICE_IN_ETH,
} from '@unilogin/commons';
import {mockGasPriceOracle} from '@unilogin/commons/testutils';
import {beta2, gnosisSafe, deployGnosisSafe, deployProxyFactory, deployDefaultCallbackHandler} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {Config} from '../../config/config';
import Relayer from './Relayer';
import {getConfigForNetwork} from '../../config/config';
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
  sentCodes: Record<string, string> = {};

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
    const mockToken = await deployContract(wallet, mockContracts.MockDai);
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

  static createTestRelayer(overrideConfig: DeepPartial<Config>, providerWithENS: providers.JsonRpcProvider) {
    const config = {...getConfigForNetwork('ganache'), ...overrideConfig} as Config;
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
    mockGasPriceOracle(this.gasPriceOracle);
    this.emailService.sendConfirmationMail = async (email: string, code: string) => {this.sentCodes[email] = code;};
    await this.setupTestPartner();
    (this.futureWalletHandler as any).tokenDetailsService.getTokenDetails = (address: string) => TEST_TOKEN_DETAILS.find(token => token.address === address);
    this.tokenPricesService.getTokenPriceInEth = (tokenDetails: any) => Promise.resolve(tokenDetails?.address === ETHER_NATIVE_TOKEN.address ? 1 : TEST_TOKEN_PRICE_IN_ETH);
  }

  getServer() {
    return this.server;
  }

  clearDatabase() {
    return clearDatabase(this.database);
  }

  setupTestPartner() {
    return addRefundPayer(this, TEST_REFUND_PAYER);
  }

  async stop() {
    await clearDatabase(this.database);
    (this.walletContractService as any).walletVersions = {};
    await super.stopLater();
  }
}

export async function clearDatabase(knex: Knex) {
  await knex('email_confirmations').del();
  await knex('encrypted_wallets').del();
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
