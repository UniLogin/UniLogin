import {expect} from 'chai';
import {getSuggestionId} from '../../lib/react/getSuggestionId';

describe('getSuggestionId', () => {
  it('returns proper id name', () => {
    expect(getSuggestionId('connect to existing')).to.eq('connect-to-existing');
    expect(getSuggestionId('create new')).to.eq('create-new');
  });
});
