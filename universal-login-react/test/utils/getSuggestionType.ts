import {expect} from 'chai';
import {getSuggestionType} from '../../src/core/utils/getSuggestionType';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';

describe('getSuggestionType', () => {
  it('SingleCreation', () => {
    expect(getSuggestionType(['user.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS)).be.eq('SingleCreation');
  });

  it('SingleConnection', () => {
    expect(getSuggestionType([], ['user.mylogin.eth'], [WalletSuggestionAction.connect, WalletSuggestionAction.create])).be.eq('SingleConnection');
  });

  describe('Multiple', () => {
    it('More than 1 creations, 0 connections', () => {
      expect(getSuggestionType(['user.mylogin.eth', 'user2.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS)).be.eq('Multiple');
    });

    it('More than 1 connections, 0 creations', () => {
      expect(getSuggestionType([], ['user.mylogin.eth', 'user2.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS)).be.eq('Multiple');
    });

    it('1 connections with recover action', () => {
      expect(getSuggestionType([], ['user.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS)).be.eq('Multiple');
    });
  });

  it('KeepTyping', () => {
    expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS)).be.eq('KeepTyping');
  });
});
