import {expect} from 'chai';
import {areValid} from '../../src/app/areValid';

describe('UNIT: areValid', () => {
  const alwaysPassingValidator = {
    validate: () => true,
    errorMessage: 'Always pass',
  };
  const errorMessage = 'Always failing';
  const alwaysFailingValidator = {
    validate: () => false,
    errorMessage,
  };

  it('retruns areValid and no error for always passing validator', async () => {
    expect(await areValid([alwaysPassingValidator], 'something')).to.deep.eq([true, []]);
  });

  it('retruns areValid false and error for always failing validator', async () => {
    expect(await areValid([alwaysFailingValidator], 'something')).to.deep.eq([false, [errorMessage]]);
  });

  it('return array of errors ', async () => {
    expect(await areValid([alwaysFailingValidator, alwaysFailingValidator], 'something')).to.deep.eq([false, [errorMessage, errorMessage]]);
  });

  it('for one passing and second failing returns one error', async () => {
    expect(await areValid([alwaysPassingValidator, alwaysFailingValidator], 'something')).to.deep.eq([false, [errorMessage]]);
  });
});
