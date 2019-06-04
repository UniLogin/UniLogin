import {deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster';
import Token from '../../lib/dev/Token.json';
import ENSBuilder from 'ens-builder';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, relayerConstructor) {
  const walletMaster = await deployContract(wallet, WalletMaster);
  const tokenContract = await deployContract(wallet, Token, []);
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
    contractWhiteList: {
      master: [],
      proxy: ['0x70aa6ef04860e3effad48a2e513965ff76c08c96b7586dfd9e01d4da08e00ccb']
    }
  });
  const relayer = new relayerConstructor(config, wallet.provider);
  await relayer.start();
  return {relayer, tokenContract};
}

module.exports = {startRelayer, defaultDomain};
