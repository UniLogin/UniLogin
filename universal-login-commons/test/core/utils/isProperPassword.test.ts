import {expect} from 'chai';
import {isProperPassword} from '../../../src/core/utils/isProperPassword';

describe('UNIT: isProperPassword', () => {
  describe('Correct passwords', () => {
    const correctPasswords = [
      '$uperPassword123',
      'CorrectPass',
      '10Digits10',
      'WhatACorrectPass',
    ];

    correctPasswords.forEach(password => it(password, () => {
      expect(isProperPassword(password)).be.eq(true);
    }));
  });

  describe('Incorrect passwords', () => {
    const incorrectPasswords = [
      'superpassword',
      'pass',
      'Pass',
      '$uperpassword',
      'withdigits123',
    ];

    incorrectPasswords.forEach(password => it(password, () => {
      expect(isProperPassword(password)).be.eq(false);
    }));
  });
});
