import publicIP from 'react-native-public-ip';
import {detect} from 'detect-browser';
import iplocation from 'iplocation';
import moment from 'moment';

async function getLabel() {
  const ipAddress = await publicIP();
  const browser = detect();
  const {city} = await iplocation(ipAddress);
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
