import {expect} from 'chai';
import {utils} from 'ethers';
import {convert10sGweiToWei} from '../../../lib/integration/ethereum/conversion';

describe('UNIT: conversion ethers', () => {
  it('parse 1 10GWEI to WEI', () => {
    expect(convert10sGweiToWei(1)).to.deep.equal(utils.bigNumberify('10000000000'));
  });

  it('parse 0 10GWEI to WEI', () => {
    expect(convert10sGweiToWei(0)).to.deep.equal(utils.bigNumberify('0'));
  });

  it('parse 1.5 10GWEI to WEI', () => {
    expect(convert10sGweiToWei(1.5)).to.deep.equal(utils.bigNumberify('15000000000'));
  });
});
