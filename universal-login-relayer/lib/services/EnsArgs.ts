import {utils} from 'ethers';
import {parseDomain} from '@universal-login/commons';
import {InvalidENSDomain} from '../utils/errors';

export const ensArgs = (ensAddress: string, supportedDomains: string[]) => (ensName: string) => {
  const [label, domain] = parseDomain(ensName);
  if (!supportedDomains.includes(domain)) {
    throw new InvalidENSDomain(ensName);
  }
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const hashDomain = utils.namehash(domain);
  const node = utils.namehash(`${label}.${domain}`);
  return [hashLabel, ensName, node, hashDomain, ensAddress];
};

export type EnsArgs = ReturnType<typeof ensArgs>;
