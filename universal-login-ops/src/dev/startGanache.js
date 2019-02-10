import {promisify} from 'util';
import Ganache from 'ganache-core';
import {defaultAccounts} from 'ethereum-waffle';

async function startGanache(port) {
  const options = {accounts: defaultAccounts};
  const server = Ganache.server(options);
  const listenPromise = promisify(server.listen);
  await listenPromise(port);
  const nodeUrl = `http://localhost:${port}`;
  console.log(`Ganache up and running on ${nodeUrl}...`);
  return nodeUrl;
}

module.exports = startGanache;
