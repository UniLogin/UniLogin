import Knex from 'knex';
import {providers, Wallet, ContractFactory, utils} from 'ethers';
const ENSBuilder = require('ens-builder');
import {withENS, getContractHash, ContractJSON, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {getDeployData} from '@universal-login/contracts';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {Config} from '../config/relayer';
import Relayer from '../relayer';

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

export class RelayerUnderTest extends Relayer {
  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const walletMaster = await deployContract(wallet, WalletMaster);
    const initCode = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
    const factoryContract = await deployContract(wallet, Factory, [initCode]);
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
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
    const contractWhiteList = getContractWhiteList();
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
      supportedTokens
    };
    const relayer = new RelayerUnderTest(config, providerWithENS);
    return {relayer, factoryContract, supportedTokens, contractWhiteList, walletMaster, mockToken};
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

async function deployContract(wallet: Wallet, contractJSON: ContractJSON, args = []) {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy(...args);
}

export async function clearDatabase(knex: Knex) {
  await knex.delete().from('finalMessages');
  await knex.delete().from('signature_key_pairs');
  await knex.delete().from('messages');
  await knex.delete().from('authorisations');
}

export const getContractWhiteList = () => ({
  master: [],
  proxy: [getContractHash(ProxyContract as ContractJSON)]
});
