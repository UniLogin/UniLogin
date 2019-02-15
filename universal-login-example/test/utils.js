import {utils} from 'ethers';
import {sleep} from 'universal-login-commons';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

const waitUntil = async (predicate, tick = 25, timeout = 2500, args = []) => {
  let elapsed = 0;
  while (!await predicate(...args)) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }
    await sleep(tick);
    elapsed += tick;
  }
  return true;
};

async function getLogs(provider, address, contractJson, eventName) {
  const {topic} = new utils.Interface(contractJson.interface).events[eventName];
  const contractInterface = new utils.Interface(contractJson.interface);
  const filter = {fromBlock: 0, address, topics: [topic]};
  const events = await provider.getLogs(filter);
  return events.map((event) => contractInterface.parseLog(event).values);
}

export {addressToBytes32, waitUntil, getLogs};
