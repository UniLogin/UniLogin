import {expect} from 'chai';
import {getSuggestionType} from '../../src/core/utils/getSuggestionType';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';

describe('getSuggestionType', () => {
  const ensName = 'user';
  const domain1 = 'mylogin.eth';
  const domain2 = 'mylogin2.eth';

  it('Creation', () => {
    expect(getSuggestionType([`${ensName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, ensName))
      .be.deep.eq({kind: 'Creation', name: `${ensName}.${domain1}`});
  });

  it('Connection', () => {
    expect(getSuggestionType([], [`${ensName}.${domain1}`], [WalletSuggestionAction.connect], ensName))
      .be.deep.eq({kind: 'Connection', name: `${ensName}.${domain1}`});
  });

  describe('Available', () => {
    it('More than 1 creations, empty connections', () => {
      expect(getSuggestionType([`${ensName}.${domain1}`, `${ensName}.${domain2}`], [], WALLET_SUGGESTION_ALL_ACTIONS, ensName))
        .be.deep.eq({kind: 'Available', suggestions: []});
    });

    it('More than 1 connections, empty creations', () => {
      expect(getSuggestionType([], [`${ensName}.${domain1}`, `${ensName}.${domain2}`], WALLET_SUGGESTION_ALL_ACTIONS, ensName))
        .be.deep.eq({kind: 'Available', suggestions: []});
    });

    it('1 connections with recover action', () => {
      expect(getSuggestionType([], [`${ensName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, ensName))
        .be.deep.eq({kind: 'Available', suggestions: []});
    });
  });

  describe('KeepTyping', () => {
    const shortEnsName = 'us';
    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestionType([], [`${shortEnsName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType([`${shortEnsName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });
  });

  describe('None', () => {
    const emptyEnsName = '';
    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestionType([], [`${emptyEnsName}.${domain1}`], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType([`${emptyEnsName}.${domain1}`], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, ensName))
        .be.deep.eq({kind: 'None'});
    });
  });
});
