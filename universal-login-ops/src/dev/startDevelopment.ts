import {startGanache} from './startGanache.js';
import {deployENS} from './deployEns.js';
import deployWalletMaster from './deployWalletMaster';
import deployToken from './deployToken';
import {getWallets} from 'ethereum-waffle';
import {providers, Wallet, utils} from 'ethers';
import ensureDatabaseExist from '../common/ensureDatabaseExist';
import Proxy from '@universal-login/contracts/build/Proxy.json';
import {startDevelopmentRelayer} from './startRelayer';
import {RelayerClass} from '@universal-login/relayer';
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

function getRelayerConfig(jsonRpcUrl: string, wallet: Wallet, walletMasterAddress: string, tokenContractAddress: string, ensAddress: string, ensRegistrars: string[], validMasterCodes: string[], validProxyCodes: string[]) {
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
    validMasterCodes,
    validProxyCodes
  };
}

function getHashDeployedProxyAbicode() {
  const proxyContractHash = utils.keccak256(`0x${Proxy.evm.deployedBytecode.object}`);
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
  const proxyContractHash = getHashDeployedProxyAbicode();
  const tokenAddress = await deployToken(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  const validMasterCodes =  [masterContractHash];
  const validProxyCodes = [proxyContractHash];
  const relayerConfig = getRelayerConfig(jsonRpcUrl, deployWallet, address, tokenAddress, ensAddress, ensDomains, validMasterCodes, validProxyCodes);
  await startDevelopmentRelayer(relayerConfig, provider, relayerClass);
  return {jsonRpcUrl, deployWallet, address, tokenAddress, ensAddress, ensDomains};
}

export default startDevelopment;
