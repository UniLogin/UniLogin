import {dirname, join} from 'path';
import {defaultAccounts} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';
import {start as startRelayer} from '@unilogin/relayer';
import {deployDefaultCallbackHandler} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {ensureDatabaseExist} from '../common/ensureDatabaseExist';
import {startGanache} from './startGanache';
import {deployENS} from './deployEns';
import {deployGnosisSafe} from './deployWalletContractOnDev';
import deployToken from './deployToken';
import {deployGnosisFactory} from '../ops/deployFactory';
import deployENSRegistrar from '../ops/deployENSRegistrar';
import createEnv from '../common/createEnv';

const ganachePort = 18545;

const databaseConfig = {
  client: 'postgresql',
  connection: {
    database: 'universal_login_relayer_development',
    user: 'postgres',
    password: 'postgres',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: getMigrationPath(),
    loadExtensions: ['.js'],
  },
};

const ensDomains = ['mylogin.eth', 'universal-id.eth', 'popularapp.eth'];

function getMigrationPath() {
  const packagePath = require.resolve('@unilogin/relayer/package.json');
  return join(dirname(packagePath), 'dist', 'cjs', 'src', 'integration', 'sql', 'migrations');
}

async function startDevelopment() {
  const jsonRpcUrl = await startGanache(ganachePort);
  const provider = new providers.JsonRpcProvider(jsonRpcUrl);
  const wallets = defaultAccounts.map((account) => new Wallet(account.secretKey, provider));
  printWallets(wallets);
  const [, , , , ensDeployer, deployWallet] = wallets;
  const ensAddress = await deployENS(ensDeployer, ensDomains);
  const {address} = await deployGnosisSafe(deployWallet);
  await deployDefaultCallbackHandler(deployWallet);
  await deployGnosisFactory(deployWallet, {nodeUrl: 'dev', privateKey: 'dev'});
  const saiTokenAddress = await deployToken(deployWallet, mockContracts.MockSai);
  const daiTokenAddress = await deployToken(deployWallet, mockContracts.MockDai);
  await deployENSRegistrar(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  await startRelayer('ganache');
  return {jsonRpcUrl: provider.connection.url, deployWallet, walletContractAddress: address, saiTokenAddress, daiTokenAddress, ensAddress, ensDomains};
}

export async function startDevAndCreateEnv() {
  const artifacts = await startDevelopment();
  return createEnv(artifacts);
};

function printWallets(wallets: Wallet[]) {
  console.log('  Wallets:');
  for (const wallet of wallets) {
    console.log(`    ${wallet.address} - ${wallet.privateKey}`);
  }
  console.log('');
}

export default startDevelopment;
