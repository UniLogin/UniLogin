import {expect} from 'chai';
import {getSuggestionId} from '../../lib/react/getSuggestionId';

describe('getSuggestionId', () => {
  it('returns proper id name', () => {
    expect(getSuggestionId('connect')).to.eq('connect');
    expect(getSuggestionId('create new')).to.eq('create-new');
  });
});
