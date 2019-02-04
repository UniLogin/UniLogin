const {promisify} = require('util');
const Ganache = require('ganache-core');
const {defaultAccounts} = require('ethereum-waffle');
const {getNodeUrl} = require('../utils');

async function startGanache(config) {
  const options = {accounts: defaultAccounts};
  const server = Ganache.server(options);
  const listenPromise = promisify(server.listen);
  await listenPromise(config.port);
  const nodeUrl = getNodeUrl(config);
  console.log(`Ganache up and running on ${nodeUrl}...`);
  return nodeUrl;
}

module.exports = startGanache;
