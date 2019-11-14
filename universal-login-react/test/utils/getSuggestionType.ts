import {expect} from 'chai';
import {getSuggestionType} from '../../src/core/utils/getSuggestionType';
import {WalletSuggestionAction, WALLET_SUGGESTION_ALL_ACTIONS} from '@universal-login/commons';

describe('getSuggestionType', () => {
  it('Creation', () => {
    expect(getSuggestionType(['user.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
  });

  it('Connection', () => {
    expect(getSuggestionType([], ['user.mylogin.eth'], [WalletSuggestionAction.connect], 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
  });

  describe('Available', () => {
    it('More than 1 creations, empty connections', () => {
      expect(getSuggestionType(['user.mylogin.eth', 'user.mylogin2.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Creation', name: 'user.mylogin2.eth'}]});
    });

    it('More than 1 connections, empty creations', () => {
      expect(getSuggestionType([], ['user.mylogin.eth', 'user.mylogin2.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Connection', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });

    xit('1 connections with recover action', () => {
      expect(getSuggestionType([], ['user.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Connection', name: 'user.mylogin.eth'}]});
    });

    it('Connection and creation', () => {
      expect(getSuggestionType(['user.mylogin.eth'], ['user.mylogin2.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
       .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });
  });

  describe('KeepTyping', () => {
    const shortEnsName = 'us';
    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestionType([], ['us.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType(['us.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
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
      expect(getSuggestionType([], ['.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestionType(['.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, empty creations', () => {
      expect(getSuggestionType([], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'None'});
    });
  });
});
