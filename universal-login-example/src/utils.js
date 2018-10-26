import {Interface} from 'ethers';

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

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

export {fetchEventsOfType, classnames};
