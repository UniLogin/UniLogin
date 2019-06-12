import Knex from 'knex';
import {providers, Wallet, ContractFactory} from 'ethers';
const ENSBuilder = require('ens-builder');
import {withENS, getContractHash, ContractJSON} from '@universal-login/commons';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import Factory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import Proxy from '@universal-login/contracts/build/Proxy.json';
import {Config} from '../config/relayer';
import Relayer from '../relayer';

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

export class RelayerUnderTest extends Relayer {
  static async createPreconfigured(wallet: Wallet, port = '33111') {
    const { address } = await deployContract(wallet, WalletMaster);
    const factoryContract = await deployContract(wallet, Factory);
    const ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);
    const providerWithENS = withENS(wallet.provider as providers.Web3Provider, ensAddress);
    const config: Config = {
      port,
      privateKey: wallet.privateKey,
      chainSpec: {
        name: 'test',
        ensAddress: ensBuilder.ens.address,
        chainId: 0,
      },
      ensRegistrars: [DOMAIN],
      walletMasterAddress: address,
      contractWhiteList: getContractWhiteList(),
      factoryAddress: factoryContract.address
    };
    return new RelayerUnderTest(config, providerWithENS);
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

async function deployContract(wallet: Wallet, contractJSON: ContractJSON) {
  const factory = new ContractFactory(contractJSON.abi, contractJSON.bytecode, wallet);
  return factory.deploy();
}

export async function clearDatabase(knex: Knex) {
  await knex.delete().from('transactions');
  await knex.delete().from('signature_key_pairs');
  await knex.delete().from('messages');
  await knex.delete().from('authorisations');
}

export const getContractWhiteList = () => ({
  master: [],
  proxy: [getContractHash(Proxy)]
});
