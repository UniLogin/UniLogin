import {utils, Wallet} from 'ethers';
import scrypt from 'scrypt-js';

async function fetchEventsOfType(provider, abi, address, name) {
  const eventInterface = new utils.Interface(abi).events;
  const topic = [eventInterface[name].topic];
  const filter = {fromBlock: 0, address, topics: topic};
  const logs = await provider.getLogs(filter);
  return logs.map((event) => (new utils.Interface(abi)).parseLog(event));
}

const convertIPv6ToIPv4 = (addressIPv6) => addressIPv6.replace(/::ffff:/g, '');

const localhostAddresses = ['::1', '127.0.0.1', '::ffff:127.0.0.1'];

function filterIP(ipAddress) {
  if (localhostAddresses.includes(ipAddress)) {
    return 'localhost';
  }
  return convertIPv6ToIPv4(ipAddress);
}


function fromBrainWallet(username, password) {
  if (typeof(username) === 'string') {
    username =  utils.toUtf8Bytes(username, 'NFKC');
  } else {
    username = utils.arrayify(username, 'password');
  }
  if (typeof(password) === 'string') {
    password =  utils.toUtf8Bytes(password, 'NFKC');
  } else {
    password = utils.arrayify(password, 'password');
  }

  return new Promise(function(resolve, reject) {
    // eslint-disable-next-line no-unused-vars
    scrypt(password, username, (1 << 18), 8, 1, 32, function(error, progress, key) {
      if (error) {
        reject(error);

      } else if (key) {
        resolve(new Wallet(utils.hexlify(key)));
      }
    });
  });
}

const scrollTo = (x, y) => {
  if (navigator.userAgent.search('jsdom') < 0) {
    window.scrollTo(x, y);
  }
};

export {fetchEventsOfType, convertIPv6ToIPv4, filterIP, fromBrainWallet, scrollTo};
