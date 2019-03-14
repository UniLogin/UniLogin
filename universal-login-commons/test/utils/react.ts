import {classesForElement} from '../../lib/utils/react';
import {expect} from 'chai';

const classesForInput = classesForElement('input', 'input');

describe('classForElement', () => {
  it('returns one class for empty argument', () => {
    expect(classesForInput()).to.eq('input');
  });

  it('with two arruments', () => {
    expect(classesForInput('transfer-amount')).to.eq('input input-transfer-amount');
  });
});
