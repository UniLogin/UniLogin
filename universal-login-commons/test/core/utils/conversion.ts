import {expect} from 'chai';
import {utils} from 'ethers';
import {convertTenthGweiToWei} from '../../../lib/core/utils/conversion';

describe('UNIT: conversion ethers', () => {
  it('parse 1 1/10 GWEI to WEI', () => {
    expect(convertTenthGweiToWei(1)).to.deep.equal(utils.bigNumberify('100000000'));
  });

  it('parse 0 1/10 GWEI to WEI', () => {
    expect(convertTenthGweiToWei(0)).to.deep.equal(utils.bigNumberify('0'));
  });

  it('parse 1.5 10GWEI to WEI', () => {
    expect(convertTenthGweiToWei(1.5)).to.deep.equal(utils.bigNumberify('150000000'));
  });
});
