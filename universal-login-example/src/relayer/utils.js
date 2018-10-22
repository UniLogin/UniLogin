import {Contract, Interface} from 'ethers';

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForContractDeploy = async (providerOrWallet, contractJSON, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  const abi = contractJSON.interface;
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt) {
    sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return new Contract(receipt.contractAddress, abi, providerOrWallet);
};

async function fetchEventsOfType(provider, abi, address, name) {
  const eventInterface = new Interface(abi).events;
  const topics = [eventInterface[name].topics];
  const filter = {fromBlock: 0, address, topics};
  const logs = await provider.getLogs(filter);
  return logs.map((event) => eventInterface[name].parse(event.topics, event.data));
}

function classnames(classes = {}) {
  return Object.entries(classes)
    .filter(([key, value]) => value)
    .map(([key, value]) => key)
    .join(' ');
}

export {waitForContractDeploy, fetchEventsOfType, classnames};
