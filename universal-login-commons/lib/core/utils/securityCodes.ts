import {utils} from 'ethers';
import deepEqual from 'deep-equal';
import {ensure} from './errors';
import {isProperAddress, reverseHexString} from './hexStrings';
import {shuffle, array8bitTo16bit} from './arrays';
import {Notification} from '../models/notifications';
import clonedeep from 'lodash.clonedeep';

export const ALPHABET_SIZE = 1024;
export const SECURITY_CODE_LENGTH = 6;
export const MASK = 1023;

export const generateCodeWithFakes = (publicKey: string): number[] => {
  ensure(isProperAddress(publicKey), Error, `Address ${publicKey} is not valid.`);
  const code = generateCode(publicKey);
  const redundantCode = generateCode(reverseHexString(publicKey));
  return shuffle([...code, ...redundantCode]);
};

export const generateCode = (publicKey: string): number[] => {
  return addressTo16bitBytes(publicKey)
    .slice(0, SECURITY_CODE_LENGTH)
    .map((e) => e & MASK);
};

export const isValidCode = (code: number[], publicKey: string) => {
  const expectedCode = generateCode(publicKey);
  return deepEqual(expectedCode, code);
};

export const findValidAddressFromPartCode = (code: number[], incomingPublicKeys: string[]) => {
  const possibleAddresses = findPossibleAddressesFromPartCode(code, incomingPublicKeys);
  return possibleAddresses.length === 1 ? possibleAddresses[0] : undefined;
};

export const findPossibleAddressesFromPartCode = (code: number[], incomingPublicKeys: string[]) => {
  return incomingPublicKeys.filter((incomingPublicKey) => {
    const expectedCode = generateCode(incomingPublicKey);
    const expectedCodeSlice = expectedCode.slice(0, code.length);
    return deepEqual(expectedCodeSlice, code);
  });
};

export const addressTo16bitBytes = (publicKey: string): number[] => {
  const hash = utils.keccak256(publicKey);
  const bytes8bit = Array.from(utils.arrayify(hash));
  return array8bitTo16bit(bytes8bit);
};

const addCodeWithFakes = (notification: Notification) =>
  ({...notification, securityCodeWithFakes: generateCodeWithFakes(notification.key)});

export const addCodesToNotifications = (notifications: Notification[]) =>
  notifications.map((notification) => {
    const notificationCopy = clonedeep(notification);
    return addCodeWithFakes(notificationCopy);
  });

export const isProperCodeNumber = (code: number) => {
  return 0 <= code && code < 1024;
};

export const isProperSecurityCode = (securityCode: number[]) => {
  return securityCode.length === 6 &&
          securityCode.every((e: number) => isProperCodeNumber(e));
};

export const isProperSecurityCodeWithFakes = (securityCode: number[]) => {
  return securityCode.length === 12 &&
          securityCode.every((e: number) => isProperCodeNumber(e));
};
