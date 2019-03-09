import {promisify} from 'util';
import Ganache from 'ganache-core';
import {defaultAccounts} from 'ethereum-waffle';
import {getWallets} from 'ethereum-waffle';
import {providers} from 'ethers';

function printWallets(wallets) {
  console.log('  Wallets:')
  for (const wallet of wallets) {
    console.log(`    ${wallet.address} - ${wallet.privateKey}`);
  }
  console.log('');
}

async function startGanache(port) {
  const options = {accounts: defaultAccounts};
  const server = Ganache.server(options);
  const listenPromise = promisify(server.listen);
  await listenPromise(port);

  const jsonRpcUrl = `http://localhost:${port}`;

  const provider = new providers.JsonRpcProvider(jsonRpcUrl);
  const wallets = await getWallets(provider);
  printWallets(wallets);


  console.log(`  Node url (ganache): ${jsonRpcUrl}...`);
  return jsonRpcUrl;
}

module.exports = startGanache;
