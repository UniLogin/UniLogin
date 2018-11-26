import publicIP from 'react-native-public-ip';
import {detect} from 'detect-browser';
import moment from 'moment';
import geoip from 'geoip-lite';

async function getLabel() {
  const ipAddress = await publicIP();
  const browser = detect();
  const city = geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown';
  return {
    ipAddress,
    name: browser.name,
    city,
    time: moment().format('h:mm'),
    os: browser.os,
    version: browser.version
  };
}

export default getLabel;
