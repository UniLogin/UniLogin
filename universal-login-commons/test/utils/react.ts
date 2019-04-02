import {classesForElement, getSuggestionId} from '../../lib/utils/react';
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

describe('getSuggestionId', () => {
  it('returns proper id name', () => {
    expect(getSuggestionId('connect to existing')).to.eq('connect-to-existing');
    expect(getSuggestionId('create new')).to.eq('create-new');
  });
});
