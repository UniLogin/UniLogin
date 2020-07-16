
// This file is copied and modified to support array of addresses when checking filters from ethers@4.0.47 repository :
// https://raw.githubusercontent.com/ethers-io/ethers.js/427e16826eb15d52d25c4f01027f8db22b74b76c/src.ts/providers/base-provider.ts

import {errors, providers, utils} from 'ethers';
const {bigNumberify, getAddress, hexDataLength, hexlify, hexStripZeros, isHexString} = utils;

function check(format: any, object: any): any {
  const result: any = {};
  for (const key in format) {
    try {
      const value = format[key](object[key]);
      if (value !== undefined) {result[key] = value;}
    } catch (error) {
      error.checkKey = key;
      error.checkValue = object[key];
      throw error;
    }
  }
  return result;
}

type CheckFunc = (value: any) => any;

function allowNull(check: CheckFunc, nullValue?: any): CheckFunc {
  return function (value: any) {
    if (value == null) {return nullValue;}
    return check(value);
  };
}

function allowFalsish(check: CheckFunc, replaceValue: any): CheckFunc {
  return function (value) {
    if (!value) {return replaceValue;}
    return check(value);
  };
}

export function arrayOf(check: CheckFunc): CheckFunc {
  return function (array: any): Array<any> {
    if (!Array.isArray(array)) {throw new Error('not an array');}

    const result: any = [];

    array.forEach(function (value) {
      result.push(check(value));
    });

    return result;
  };
}

function checkHash(hash: any, requirePrefix?: boolean): string {
  if (typeof (hash) === 'string') {
    // geth-etc does add a "0x" prefix on receipt.root
    if (!requirePrefix && hash.substring(0, 2) !== '0x') {hash = '0x' + hash;}
    if (hexDataLength(hash) === 32) {
      return hash.toLowerCase();
    }
  }
  errors.throwError('invalid hash', errors.INVALID_ARGUMENT, {arg: 'hash', value: hash});
  return '';
}

function checkNumber(number: any): number {
  return bigNumberify(number).toNumber();
}

function checkBoolean(value: any): boolean {
  if (typeof (value) === 'boolean') {return value;}
  if (typeof (value) === 'string') {
    if (value === 'true') {return true;}
    if (value === 'false') {return false;}
  }
  throw new Error('invaid boolean - ' + value);
}

function checkBlockTag(blockTag: providers.BlockTag): string {
  if (blockTag == null) {return 'latest';}

  if (blockTag === 'earliest') {return '0x0';}

  if (blockTag === 'latest' || blockTag === 'pending') {
    return blockTag;
  }

  if (typeof (blockTag) === 'number') {
    return hexStripZeros(hexlify(blockTag));
  }

  if (isHexString(blockTag)) {return hexStripZeros(blockTag);}

  throw new Error('invalid blockTag');
}

function checkTopics(topics: any): any {
  if (Array.isArray(topics)) {
    topics.forEach(function (topic) {
      checkTopics(topic);
    });
  } else if (topics != null) {
    checkHash(topics);
  }

  return topics;
}

// Modified by us to accept list of addresses (what is consistent with json rpc documentation)
const formatFilter = {
  fromBlock: allowNull(checkBlockTag, undefined),
  toBlock: allowNull(checkBlockTag, undefined),
  address: allowNull(arrayOrTypeOf(getAddress), undefined),
  topics: allowNull(checkTopics, undefined),
};

// Modified by us to accept list of addresses (what is consistent with json rpc documentation)
const formatFilterByBlock = {
  blockHash: allowNull(checkHash, undefined),
  address: allowNull(arrayOrTypeOf(getAddress), undefined),
  topics: allowNull(checkTopics, undefined),
};

// This function is added by us to be adaptable to json rpc documentation.
function arrayOrTypeOf(check: CheckFunc): CheckFunc {
  return function (arrayOrValue: any): Array<any> {
    if (!Array.isArray(arrayOrValue)) {
      return check(arrayOrValue);
    }

    const result: any = [];

    arrayOrValue.forEach(function (value) {
      result.push(check(value));
    });

    return result;
  };
}

export function checkFilter(filter: any): any {
  if (filter && filter.blockHash) {
    return check(formatFilterByBlock, filter);
  }
  return check(formatFilter, filter);
}

const formatLog = {
  blockNumber: allowNull(checkNumber),
  blockHash: allowNull(checkHash),
  transactionIndex: checkNumber,

  removed: allowNull(checkBoolean),

  address: getAddress,
  data: allowFalsish(hexlify, '0x'),

  topics: arrayOf(checkHash),

  transactionHash: checkHash,
  logIndex: checkNumber,
};

export function checkLog(log: any): any {
  return check(formatLog, log);
}
