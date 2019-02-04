const startGanache = require('./startGanache.js');
const deployEns = require('./deployEns.js');
const deployToken = require('./deployToken');
const {getWallets} = require('ethereum-waffle');
const {providers} = require('ethers');
const ensureDatabaseExist = require('../common/ensureDatabaseExist');
const startRelayer = require('./startRelayer');
const knex = require('knex');
const {dirname, join} = require('path');

const defaultNodeConfig = {
  port: 18545,
  address: process.argv.length > 2 ? process.argv[2] : 'localhost'
};

function getMigrationPath() {
  const packagePath = require.resolve('universal-login-relayer/package.json');
  return join(dirname(packagePath), 'migrations');
}

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

function getNodeConfig() {
  return defaultNodeConfig;
}

function getRelayerConfig(jsonRpcUrl, wallet, tokenContractAddress, ensAddress, ensRegistrars) {
  return {
    port: 3311,
    jsonRpcUrl,
    privateKey: wallet.privateKey,
    tokenContractAddress,
    chainSpec: {
      ensAddress,
      chainId: 0
    },
    ensRegistrars
  };
}

async function startDevelopment() {
  const config = getNodeConfig();
  const jsonRpcUrl = await startGanache(config);
  const provider = new providers.JsonRpcProvider(jsonRpcUrl, config.chainSpec);
  const [deployWallet, relayerWallet] = await getWallets(provider);
  const ensAddress = await deployEns(deployWallet, ensDomains);
  const tokenAddress = await deployToken(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  const relayerConfig = getRelayerConfig(jsonRpcUrl, relayerWallet, tokenAddress, ensAddress, ensDomains);
  await startRelayer(relayerConfig, knex(databaseConfig), relayerWallet);
  return {jsonRpcUrl, deployWallet, tokenAddress, ensAddress, ensDomains};
}

module.exports = startDevelopment;
