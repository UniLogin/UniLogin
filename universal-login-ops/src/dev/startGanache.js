import {promisify} from 'util';
import Ganache from 'ganache-cli';
import {defaultAccounts} from 'ethereum-waffle';

async function startGanache(port) {
  const options = {accounts: defaultAccounts, hardfork: 'constantinople', network_id: 8545};
  const server = Ganache.server(options);
  const listenPromise = promisify(server.listen);
  await listenPromise(port);

  const jsonRpcUrl = `http://localhost:${port}`;

  console.log(`  Node url (ganache): ${jsonRpcUrl}...`);
  return jsonRpcUrl;
}

export {startGanache};
