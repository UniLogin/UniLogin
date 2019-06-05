import {dirname, join} from 'path';
import {getWallets} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';
import {ContractWhiteList, getContractHash} from '@universal-login/commons';
import {RelayerClass} from '@universal-login/relayer';
import Proxy from '@universal-login/contracts/build/Proxy.json';
import ensureDatabaseExist from '../common/ensureDatabaseExist';
import {startDevelopmentRelayer} from './startRelayer';
import {startGanache} from './startGanache.js';
import {deployENS} from './deployEns.js';
import deployWalletMaster from './deployWalletMaster';
import deployToken from './deployToken';

const ganachePort = 18545;

const databaseConfig = {
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_development',
    user:     'postgres',
    password: 'postgres'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: getMigrationPath()
  }
};

const ensDomains = ['mylogin.eth', 'universal-id.eth', 'popularapp.eth'];

function getRelayerConfig(jsonRpcUrl: string, wallet: Wallet, walletMasterAddress: string, tokenContractAddress: string, ensAddress: string, ensRegistrars: string[], contractWhiteList: ContractWhiteList) {
  return {
    port: 3311,
    jsonRpcUrl,
    privateKey: wallet.privateKey,
    walletMasterAddress,
    tokenContractAddress,
    chainSpec: {
      ensAddress,
      chainId: 0
    },
    ensRegistrars,
    contractWhiteList
  };
}

function getProxyContractHash() {
  const proxyContractHash = getContractHash(Proxy);
  console.log(`ProxyContract hash: ${proxyContractHash}`);
  return proxyContractHash;
}

function getMigrationPath() {
  const packagePath = require.resolve('@universal-login/relayer/package.json');
  return join(dirname(packagePath), 'migrations');
}

declare interface startDevelopmentOverrides {
  nodeUrl?: string;
  relayerClass?: RelayerClass;
}

async function startDevelopment({nodeUrl, relayerClass} : startDevelopmentOverrides = {}) {
  const jsonRpcUrl = nodeUrl ? nodeUrl : await startGanache(ganachePort);
  const provider = new providers.JsonRpcProvider(jsonRpcUrl);
  const [,,,, ensDeployer, deployWallet] = await getWallets(provider);
  const ensAddress = await deployENS(ensDeployer, ensDomains);
  const {address, masterContractHash} = await deployWalletMaster(deployWallet);
  const proxyContractHash = getProxyContractHash();
  const tokenAddress = await deployToken(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  const contractWhiteList = {
    master:  [masterContractHash],
    proxy: [proxyContractHash]
  };
  const relayerConfig = getRelayerConfig(jsonRpcUrl, deployWallet, address, tokenAddress, ensAddress, ensDomains, contractWhiteList);
  await startDevelopmentRelayer(relayerConfig, provider, relayerClass);
  return {jsonRpcUrl, deployWallet, address, tokenAddress, ensAddress, ensDomains};
}

export default startDevelopment;
