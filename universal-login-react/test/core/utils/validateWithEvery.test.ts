import {expect} from 'chai';
import {validateWithEvery} from '../../../src/app/validateWithEvery';

describe('UNIT: validateWithEvery', () => {
  const alwaysPassingValidator = {
    validate: async () => true,
    errorMessage: 'Always pass',
  };
  const errorMessage = 'Always failing';
  const alwaysFailingValidator = {
    validate: async () => false,
    errorMessage,
  };

  it('returns validateWithEvery and no error for always passing validator', async () => {
    expect(await validateWithEvery([alwaysPassingValidator], 'something')).to.deep.eq([true]);
  });

  it('returns validateWithEvery false and error for always failing validator', async () => {
    expect(await validateWithEvery([alwaysFailingValidator], 'something')).to.deep.eq([false, errorMessage]);
  });

  it('return array of errors ', async () => {
    expect(await validateWithEvery([alwaysFailingValidator, alwaysFailingValidator], 'something')).to.deep.eq([false, errorMessage]);
  });

  it('for one passing and second failing returns one error', async () => {
    expect(await validateWithEvery([alwaysPassingValidator, alwaysFailingValidator], 'something')).to.deep.eq([false, errorMessage]);
  });
});
