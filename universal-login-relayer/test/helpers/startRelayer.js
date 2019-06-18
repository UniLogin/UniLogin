import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import ProxyCounterfactualFactory from '@universal-login/contracts/build/ProxyCounterfactualFactory.json';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {getDeployData} from '@universal-login/contracts';
import Token from '../../lib/dev/Token.json';
import ENSBuilder from 'ens-builder';
import {getContractWhiteList} from '../../lib/utils/relayerUnderTest';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, relayerConstructor) {
  const walletMaster = await deployContract(wallet, WalletMaster);
  const tokenContract = await deployContract(wallet, Token, []);
  const initCode = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
  const factoryContract = await deployContract(wallet, ProxyCounterfactualFactory, [initCode])
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
    }]
  });
  const relayer = new relayerConstructor(config, wallet.provider);
  await relayer.start();
  return {relayer, tokenContract, factoryContract};
}

module.exports = {startRelayer, defaultDomain};
