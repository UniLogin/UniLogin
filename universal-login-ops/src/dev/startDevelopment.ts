import {dirname, join} from 'path';
import {getWallets} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';
import {ContractWhiteList, getContractHash, SupportedToken, ContractJSON, ETHER_NATIVE_TOKEN, UNIVERSAL_LOGIN_LOGO_URL} from '@unilogin/commons';
import {RelayerClass, Config} from '@unilogin/relayer';
import {gnosisSafe} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {ensureDatabaseExist} from '../common/ensureDatabaseExist';
import {startDevelopmentRelayer} from './startRelayer';
import {startGanache} from './startGanache';
import {deployENS} from './deployEns';
import {deployGnosisSafe} from './deployWalletContractOnDev';
import deployToken from './deployToken';
import {deployGnosisFactory} from '../ops/deployFactory';
import deployENSRegistrar from '../ops/deployENSRegistrar';

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

function getRelayerConfig(jsonRpcUrl: string, wallet: Wallet, walletContractAddress: string, ensAddress: string, ensRegistrars: string[], contractWhiteList: ContractWhiteList, factoryAddress: string, daiTokenAddress: string, saiTokenAddress: string, ensRegistrar: string) {
  const supportedTokens: SupportedToken[] = [{
    address: daiTokenAddress,
  },
  {
    address: saiTokenAddress,
  },
  {
    address: ETHER_NATIVE_TOKEN.address,
  }];
  return {
    jsonRpcUrl,
    port: '3311',
    privateKey: wallet.privateKey,
    chainSpec: {
      name: 'ganache',
      ensAddress,
      chainId: 0,
    },
    ensRegistrars,
    ensRegistrar,
    walletContractAddress,
    contractWhiteList,
    factoryAddress,
    supportedTokens,
    localization: {
      language: 'en',
      country: 'any',
    },
    onRampProviders: {
      safello: {
        appId: '1234-5678',
        baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
        addressHelper: true,
      },
      ramp: {
        appName: 'Universal Login',
        logoUrl: UNIVERSAL_LOGIN_LOGO_URL,
        rampUrl: 'https://ri-widget-staging.firebaseapp.com/',
      },
      wyre: {
        wyreUrl: 'https://pay.sendwyre.com/purchase',
        paymentMethod: 'apple-pay',
      },
    },
    database: databaseConfig,
    maxGasLimit: 500000,
    ipGeolocationApi: {
      baseUrl: 'https://api.ipdata.co',
      accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
    },
    httpsRedirect: false,
  };
}

function getProxyContractHash() {
  const proxyContractHash = getContractHash(gnosisSafe.Proxy as ContractJSON);
  console.log(`beta2.WalletProxy hash: ${proxyContractHash}`);
  return proxyContractHash;
}

function getMigrationPath() {
  const packagePath = require.resolve('@unilogin/relayer/package.json');
  return join(dirname(packagePath), 'dist', 'cjs', 'src', 'integration', 'sql', 'migrations');
}

declare interface StartDevelopmentOverrides {
  nodeUrl?: string;
  relayerClass?: RelayerClass;
}

async function startDevelopment({nodeUrl, relayerClass}: StartDevelopmentOverrides = {}) {
  const jsonRpcUrl = nodeUrl || await startGanache(ganachePort);
  const provider = new providers.JsonRpcProvider(jsonRpcUrl);
  const [, , , , ensDeployer, deployWallet] = getWallets(provider);
  const ensAddress = await deployENS(ensDeployer, ensDomains);
  const {address, walletContractHash} = await deployGnosisSafe(deployWallet);
  const proxyContractHash = getProxyContractHash();
  const factoryAddress = await deployGnosisFactory(deployWallet, {nodeUrl: 'dev', privateKey: 'dev'});
  const saiTokenAddress = await deployToken(deployWallet, mockContracts.MockSai);
  const daiTokenAddress = await deployToken(deployWallet, mockContracts.MockDai);
  const ensRegistrar = await deployENSRegistrar(deployWallet);
  await ensureDatabaseExist(databaseConfig);
  const contractWhiteList = {
    wallet: [walletContractHash],
    proxy: [proxyContractHash],
  };
  const relayerConfig: Config = getRelayerConfig(jsonRpcUrl, deployWallet, address, ensAddress, ensDomains, contractWhiteList, factoryAddress, daiTokenAddress, saiTokenAddress, ensRegistrar.address);
  await startDevelopmentRelayer(relayerConfig, provider, relayerClass);
  return {jsonRpcUrl, deployWallet, walletContractAddress: address, saiTokenAddress, daiTokenAddress, ensAddress, ensDomains};
}

export default startDevelopment;
