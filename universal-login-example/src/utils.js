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

const convertIPv6ToIPv4 = (addressIPv6) => addressIPv6.replace(/::ffff:/g, '');

function filterIP(ipAddress) {
  if(ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1') {
    return 'localhost';
  }
  return convertIPv6ToIPv4(ipAddress);
}

export {fetchEventsOfType, classnames, convertIPv6ToIPv4, filterIP};
