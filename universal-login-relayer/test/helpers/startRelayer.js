import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import {deployFactory} from '@universal-login/contracts';
import Token from '../../lib/http/relayers/abi/Token.json';
import ENSBuilder from 'ens-builder';
import {getContractWhiteList} from '../../lib/http/relayers/RelayerUnderTest';
import {getKnexConfig} from '../../lib/core/utils/knexUtils';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, relayerConstructor) {
  const walletMaster = await deployContract(wallet, WalletMaster);
  const tokenContract = await deployContract(wallet, Token, []);
  const factoryContract = await deployFactory(wallet, walletMaster.address);
  const ensAddress = await depolyEns(wallet);
  const config = Object.freeze({
    jsonRpcUrl: 'http://localhost:18545',
    port: 33511,
    privateKey: wallet.privateKey,
    chainSpec: {
      ensAddress,
      chainId: 0},
    ensRegistrars: ['mylogin.eth'],
    walletMasterAddress: walletMaster.address,
    tokenContractAddress: tokenContract.address,
    contractWhiteList: getContractWhiteList(),
    factoryAddress: factoryContract.address,
    supportedTokens: [
      {
        address: tokenContract.address,
        minimalAmount: utils.parseEther('0.5').toString()
    }],
    localization: {
      language: 'en',
      country: 'any'
    },
    onRampProviders: {
      safello: {
        appId: '1234-5678',
        baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
        addressHelper: true
      }
    },
    knexConfig: getKnexConfig(),
  });
  const relayer = new relayerConstructor(config, wallet.provider);
  await relayer.start();
  return {relayer, tokenContract, factoryContract};
}

module.exports = {startRelayer, defaultDomain};
