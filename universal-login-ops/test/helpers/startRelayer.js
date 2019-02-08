const {deployContract} = require('ethereum-waffle');
const Token = require('../../build/Token');
const ENSBuilder = require('ens-builder');
const path = require('path');
const {getKnex} = require('./knex');

const defaultDomain = 'mylogin.eth';

async function depolyEns(wallet) {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = defaultDomain.split('.');
  return await ensBuilder.bootstrapWith(label, tld);
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
    tokenContractAddress: tokenContract.address
  });
  const database = getKnex();
  const relayer = new relayerConstructor(config, database, wallet.provider);
  await relayer.database.migrate.latest({directory: path.join(__dirname, '../../../universal-login-relayer/migrations')});
  await relayer.start();
  return {relayer, tokenContract};
}

module.exports = {startRelayer, defaultDomain};
