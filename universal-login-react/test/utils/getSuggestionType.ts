import {expect} from 'chai';
import {getSuggestionType} from '../../src/core/utils/getSuggestionType';

describe('getSuggestionType', () => {
  it('SingleCreation', () => {
    expect(getSuggestionType(['user.mylogin.eth'], [])).be.eq('SingleCreation');
  });

  it('SingleConnection', () => {
    expect(getSuggestionType([], ['user.mylogin.eth'])).be.eq('SingleConnection');
  });

  it('Multiple', () => {
    expect(getSuggestionType(['user.mylogin.eth', 'user2.mylogin.eth'], [])).be.eq('Multiple');
    expect(getSuggestionType([], ['user.mylogin.eth', 'user2.mylogin.eth'])).be.eq('Multiple');
  });

  it('KeepTyping', () => {
    expect(getSuggestionType([], [])).be.eq('KeepTyping');
  });
});
