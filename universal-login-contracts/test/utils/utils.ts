import {utils} from 'ethers';

export const switchENSNameInInitializeArgs = (initializeArgs: string[], name: string, domain = 'mylogin.eth') => {
  const ensName = `${name}.${domain}`;
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const node = utils.namehash(ensName);
  initializeArgs[1] = hashLabel;
  initializeArgs[2] = ensName;
  initializeArgs[3] = node;
  return initializeArgs;
};
