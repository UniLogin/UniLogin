import {expect} from 'chai';
import {classesForElement} from '../../lib/react/classesForElement';

const classesForInput = classesForElement('input', 'input');

describe('classesForElement', () => {
  it('returns one class for empty argument', () => {
    expect(classesForInput()).to.eq('input');
  });

  it('with two arruments', () => {
    expect(classesForInput('transfer-amount')).to.eq('input input-transfer-amount');
  });
});
