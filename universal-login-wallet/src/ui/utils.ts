import getConfig from '../config/getConfig';

export function getSafelloUrl(address: string) {
  return `${getConfig().safelloUrl}&address=${address}`;
}
