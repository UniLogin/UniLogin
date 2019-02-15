import {utils} from 'ethers';

const addressToBytes32 = (address) =>
  utils.padZeros(utils.arrayify(address), 32);

async function getLogs(provider, address, contractJson, eventName) {
  const {topic} = new utils.Interface(contractJson.interface).events[eventName];
  const contractInterface = new utils.Interface(contractJson.interface);
  const filter = {fromBlock: 0, address, topics: [topic]};
  const events = await provider.getLogs(filter);
  return events.map((event) => contractInterface.parseLog(event).values);
}

export {addressToBytes32, getLogs};
