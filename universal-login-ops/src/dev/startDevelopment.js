import startGanache from './startGanache.js';
import deployEns from './deployEns.js';
import deployToken from './deployToken';
import deployFactory from './deployFactory';
import {getWallets} from 'ethereum-waffle';
import {providers} from 'ethers';
import ensureDatabaseExist from '../common/ensureDatabaseExist';
import startDevelopmentRelayer from './startDevelopmentRelayer';
import knex from 'knex';
import {dirname, join} from 'path';

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

function getRelayerConfig(jsonRpcUrl, wallet, tokenContractAddress, ensAddress, ensRegistrars, factoryAddress) {
  return {
    port: 3311,
    jsonRpcUrl,
    privateKey: wallet.privateKey,
    tokenContractAddress,
    chainSpec: {
      ensAddress,
      chainId: 0
    },
    ensRegistrars,
    factoryAddress
  };
}

function getMigrationPath() {
  const packagePath = require.resolve('universal-login-relayer/package.json');
  return join(dirname(packagePath), 'migrations');
}

async function startDevelopment(nodeUrl) {
  const jsonRpcUrl = nodeUrl ? nodeUrl : await startGanache(ganachePort);
  const provider = new providers.JsonRpcProvider(jsonRpcUrl);
  const [,,,, ensDeployer, deployWallet] = await getWallets(provider);
  const ensAddress = await deployEns(ensDeployer, ensDomains);
  const tokenAddress = await deployToken(deployWallet);
  const factoryAddress = await deployFactory(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  const relayerConfig = getRelayerConfig(jsonRpcUrl, deployWallet, tokenAddress, ensAddress, ensDomains, factoryAddress);
  await startDevelopmentRelayer(relayerConfig, deployWallet);
  return {jsonRpcUrl, deployWallet, tokenAddress, ensAddress, ensDomains, factoryAddress};
}

module.exports = startDevelopment;
