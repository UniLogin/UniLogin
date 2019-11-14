import {expect} from 'chai';
import {getSuggestion} from '../../src/core/utils/getSuggestion';
import {WALLET_SUGGESTION_ALL_ACTIONS, WalletSuggestionAction} from '@universal-login/commons';

describe('getSuggestion', () => {
  it('Creation', () => {
    expect(getSuggestion(['user.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
    expect(getSuggestion(['user.mylogin.eth'], ['user.mylogin2.eth'], [WalletSuggestionAction.create], 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
    expect(getSuggestion(['user.mylogin.eth'], [], [WalletSuggestionAction.create], 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
  });

  it('Connection', () => {
    expect(getSuggestion([], ['user.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
    expect(getSuggestion(['user.mylogin2.eth'], ['user.mylogin.eth'], [WalletSuggestionAction.connect], 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
    expect(getSuggestion([], ['user.mylogin.eth'], [WalletSuggestionAction.connect], 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
  });

  describe('Available', () => {
    it('2 creations, no connections', () => {
      expect(getSuggestion(['user.mylogin.eth', 'user.mylogin2.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Creation', name: 'user.mylogin2.eth'}]});
    });

    it('no creations, 2 connections', () => {
      expect(getSuggestion([], ['user.mylogin.eth', 'user.mylogin2.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Connection', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });

    it('Connection and creation', () => {
      expect(getSuggestion(['user.mylogin.eth'], ['user.mylogin2.eth'], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });
  });

  describe('KeepTyping', () => {
    const shortEnsName = 'us';
    it('empty connections, empty creations', () => {
      expect(getSuggestion([], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestion([], ['us.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestion(['us.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });
  });

  describe('None', () => {
    const emptyEnsName = '';
    it('empty connections, empty creations', () => {
      expect(getSuggestion([], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestion([], ['.mylogin.eth'], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestion(['.mylogin.eth'], [], WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, empty creations', () => {
      expect(getSuggestion([], [], WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'None'});
    });

    it('single creation without creation action', () => {
      expect(getSuggestion(['user.mylogin.eth'], [], [WalletSuggestionAction.connect], 'user'))
        .be.deep.eq({kind: 'None'});
      expect(getSuggestion(['user.mylogin.eth'], [], [], 'user'))
        .be.deep.eq({kind: 'None'});
    });

    it('single connection without connection action', () => {
      expect(getSuggestion([], ['user.mylogin.eth'], [WalletSuggestionAction.create], 'user'))
        .be.deep.eq({kind: 'None'});
      expect(getSuggestion([], ['user.mylogin.eth'], [], 'user'))
        .be.deep.eq({kind: 'None'});
    });
  });
});
