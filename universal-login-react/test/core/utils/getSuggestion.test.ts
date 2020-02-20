import {expect} from 'chai';
import {getSuggestion} from '../../../src/core/utils/getSuggestion';
import {WALLET_SUGGESTION_ALL_ACTIONS, WalletSuggestionAction} from '@unilogin/commons';

describe('getSuggestion', () => {
  it('Creation', () => {
    expect(getSuggestion({creations: ['user.mylogin.eth'], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
    expect(getSuggestion({creations: ['user.mylogin.eth'], connections: ['user.mylogin2.eth']}, [WalletSuggestionAction.create], 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
    expect(getSuggestion({creations: ['user.mylogin.eth'], connections: []}, [WalletSuggestionAction.create], 'user'))
      .be.deep.eq({kind: 'Creation', name: 'user.mylogin.eth'});
  });

  it('Connection', () => {
    expect(getSuggestion({creations: [], connections: ['user.mylogin.eth']}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
    expect(getSuggestion({creations: ['user.mylogin2.eth'], connections: ['user.mylogin.eth']}, [WalletSuggestionAction.connect], 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
    expect(getSuggestion({creations: [], connections: ['user.mylogin.eth']}, [WalletSuggestionAction.connect], 'user'))
      .be.deep.eq({kind: 'Connection', name: 'user.mylogin.eth'});
  });

  describe('Available', () => {
    it('2 creations, no connections', () => {
      expect(getSuggestion({creations: ['user.mylogin.eth', 'user.mylogin2.eth'], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Creation', name: 'user.mylogin2.eth'}]});
    });

    it('no creations, 2 connections', () => {
      expect(getSuggestion({creations: [], connections: ['user.mylogin.eth', 'user.mylogin2.eth']}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Connection', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });

    it('Connection and creation', () => {
      expect(getSuggestion({creations: ['user.mylogin.eth'], connections: ['user.mylogin2.eth']}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'Available', suggestions: [{kind: 'Creation', name: 'user.mylogin.eth'}, {kind: 'Connection', name: 'user.mylogin2.eth'}]});
    });
  });

  describe('TakenOrInvalid', () => {
    it('empty connections, empty creations, create action', () => {
      expect(getSuggestion({creations: [], connections: []}, [WalletSuggestionAction.create], 'user'))
        .be.deep.eq({kind: 'TakenOrInvalid'});
    });

    it('non-empty connections, empty creations, create action', () => {
      expect(getSuggestion({creations: [], connections: ['user.mylogin.eth']}, [WalletSuggestionAction.create], 'user'))
        .be.deep.eq({kind: 'TakenOrInvalid'});
    });
  });

  describe('isInvalidForConnection', () => {
    it('empty connections, empty creations, invalid name', () => {
      expect(getSuggestion({creations: [], connections: []}, [WalletSuggestionAction.connect], 'user'))
        .be.deep.eq({kind: 'InvalidForConnection'});
    });

    it('non-empty connections, empty creations, invalid name', () => {
      expect(getSuggestion({creations: ['user.mylogin.eth'], connections: []}, [WalletSuggestionAction.connect], 'user'))
        .be.deep.eq({kind: 'InvalidForConnection'});
    });
  });

  describe('KeepTyping', () => {
    const shortEnsName = 'us';
    it('empty connections, empty creations', () => {
      expect(getSuggestion({creations: [], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestion({creations: [], connections: ['us.mylogin.eth']}, WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestion({creations: ['us.mylogin.eth'], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, shortEnsName))
        .be.deep.eq({kind: 'KeepTyping'});
    });
  });

  describe('None', () => {
    const emptyEnsName = '';
    it('empty connections, empty creations', () => {
      expect(getSuggestion({creations: [], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('non-empty connections, empty creations', () => {
      expect(getSuggestion({creations: [], connections: ['.mylogin.eth']}, WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, non-empty creations', () => {
      expect(getSuggestion({creations: ['.mylogin.eth'], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, emptyEnsName))
        .be.deep.eq({kind: 'None'});
      expect(getSuggestion({creations: ['.mylogin.eth'], connections: []}, [WalletSuggestionAction.create], emptyEnsName))
        .be.deep.eq({kind: 'None'});
      expect(getSuggestion({creations: ['.mylogin.eth'], connections: []}, [WalletSuggestionAction.connect], emptyEnsName))
        .be.deep.eq({kind: 'None'});
    });

    it('empty connections, empty creations', () => {
      expect(getSuggestion({creations: [], connections: []}, WALLET_SUGGESTION_ALL_ACTIONS, 'user'))
        .be.deep.eq({kind: 'None'});
    });

    it('single creation without creation action', () => {
      expect(getSuggestion({creations: ['user.mylogin.eth'], connections: []}, [], 'user'))
        .be.deep.eq({kind: 'None'});
    });

    it('single connection with empty action', () => {
      expect(getSuggestion({creations: [], connections: ['user.mylogin.eth']}, [], 'user'))
        .be.deep.eq({kind: 'None'});
    });
  });
});
