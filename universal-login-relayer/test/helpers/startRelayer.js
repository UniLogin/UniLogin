import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import {deployFactory} from '@universal-login/contracts';
import Token from '../../lib/http/relayers/abi/Token.json';
import ENSBuilder from 'ens-builder';
import {getContractWhiteList} from '../../lib/http/relayers/RelayerUnderTest';
import {ETHER_NATIVE_TOKEN, deepMerge} from '@universal-login/commons';
import {getConfig} from '../../lib/index.js';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, relayerConstructor) {
  const walletMaster = await deployContract(wallet, WalletMaster, [], {gasLimit: 5000000});
  const tokenContract = await deployContract(wallet, Token, []);
  const factoryContract = await deployFactory(wallet, walletMaster.address);
  const ensAddress = await depolyEns(wallet);
  const overrideConfig = Object.freeze({
    jsonRpcUrl: 'http://localhost:18545',
    port: 33511,
    privateKey: wallet.privateKey,
    chainSpec: {
      ensAddress,
    },
    ensRegistrars: ['mylogin.eth'],
    walletMasterAddress: walletMaster.address,
    tokenContractAddress: tokenContract.address,
    contractWhiteList: getContractWhiteList(),
    factoryAddress: factoryContract.address,
    supportedTokens: [
      {
        address: tokenContract.address,
        minimalAmount: utils.parseEther('0.5').toString()
      },
      {
        address: ETHER_NATIVE_TOKEN.address,
        minimalAmount: utils.parseEther('0.5').toString()
      }
    ],
  });
  const config = deepMerge(getConfig('test'), overrideConfig);
  const relayer = new relayerConstructor(config, wallet.provider);
  relayer.url = () => `http://localhost:${config.port}`;
  await relayer.start();
  return {relayer, tokenContract, factoryContract};
}

module.exports = {startRelayer, defaultDomain};
