import {deployContract} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';
import {ETHER_NATIVE_TOKEN, deepMerge} from '@unilogin/commons';
import {deployFactory, beta2} from '@unilogin/contracts';
import {mockContracts} from '@unilogin/contracts/testutils';
import {getContractWhiteList} from '../../src/http/relayers/RelayerUnderTest';
import {getConfig, RelayerClass} from '../../src/index';
import {Wallet} from 'ethers';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet: Wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet: Wallet, RelayerConstructor: RelayerClass) {
  const walletContract = await deployContract(wallet, beta2.WalletContract, [], {gasLimit: 5000000});
  const tokenContract = await deployContract(wallet, mockContracts.Token, []);
  const factoryContract = await deployFactory(wallet, walletContract.address);
  const ensAddress = await depolyEns(wallet);
  const overrideConfig = Object.freeze({
    jsonRpcUrl: 'http://localhost:18545',
    port: 33511,
    privateKey: wallet.privateKey,
    chainSpec: {
      ensAddress,
    },
    ensRegistrars: ['mylogin.eth'],
    walletContractAddress: walletContract.address,
    tokenContractAddress: tokenContract.address,
    contractWhiteList: getContractWhiteList(),
    factoryAddress: factoryContract.address,
    supportedTokens: [
      {
        address: tokenContract.address,
        minimalAmount: '0.5',
      },
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: '0.5',
      },
    ],
  });
  const config = deepMerge(getConfig('test'), overrideConfig);
  const relayer = new RelayerConstructor(config, wallet.provider);
  // relayer.url = () => `http://localhost:${config.port}`;
  await relayer.start();
  return {relayer, tokenContract, factoryContract};
}

module.exports = {startRelayer, defaultDomain};
