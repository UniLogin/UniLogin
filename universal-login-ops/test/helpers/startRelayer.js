import {deployContract} from 'ethereum-waffle';
import Token from '../../src/contracts/Token.json';
import ENSBuilder from 'ens-builder';
import {getKnex} from './knex';

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return ensBuilder.bootstrapWith(label, tld);
}

async function startRelayer(wallet, relayerConstructor) {
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
    tokenContractAddress: tokenContract.address,
  });
  const database = getKnex();
  const relayer = new relayerConstructor(config, database, wallet.provider);
  await relayer.start();
  return {relayer, tokenContract};
}

module.exports = {startRelayer, defaultDomain};
