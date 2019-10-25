import {expect} from 'chai';
import {getSuggestionType} from '../../src/core/utils/getSuggestionType';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';

describe('getSuggestionType', () => {
  const ensName = 'user';
  const domain1 = 'mylogin.eth';
  const domain2 = 'mylogin2.eth';

  it('SingleCreation', () => {
    expect(getSuggestionType([`${ensName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, ensName)).be.eq('SingleCreation');
  });

  it('SingleConnection', () => {
    expect(getSuggestionType([], [`${ensName}.${domain1}`], [WalletSuggestionAction.connect], ensName)).be.eq('SingleConnection');
  });

  describe('Multiple', () => {
    it('More than 1 creations, empty connections', () => {
      expect(getSuggestionType([`${ensName}.${domain1}`, `${ensName}.${domain2}`], [], WALLET_SUGGESTION_ALL_ACTIONS, ensName)).be.eq('Multiple');
    });

    it('More than 1 connections, empty creations', () => {
      expect(getSuggestionType([], [`${ensName}.${domain1}`, `${ensName}.${domain2}`], WALLET_SUGGESTION_ALL_ACTIONS, ensName)).be.eq('Multiple');
    });

    it('1 connections with recover action', () => {
      expect(getSuggestionType([], [`${ensName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, ensName)).be.eq('Multiple');
    });
  });

  describe('KeepTyping', () => {
    const shortEnsName = 'us';
    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName)).be.eq('KeepTyping');
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestionType([], [`${shortEnsName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName)).be.eq('KeepTyping');
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType([`${shortEnsName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName)).be.eq('KeepTyping');
    });
  });

  describe('None', () => {
    const emptyEnsName = '';
    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName)).be.eq('None');
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestionType([], [`${emptyEnsName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName)).be.eq('None');
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType([`${emptyEnsName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName)).be.eq('None');
    });
  })
});
