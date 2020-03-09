import {parseDomain} from '@unilogin/commons';

const DEPRECATED_DOMAINS = ['unitest.eth'];

export const filterENSNames = (ensNames: string[]) =>
  ensNames.filter(ensName => {
    const parsedENSName = parseDomain(ensName);
    return !DEPRECATED_DOMAINS.includes(parsedENSName[1]);
  });
