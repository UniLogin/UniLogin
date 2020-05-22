/// <reference types="cypress" />

import Web3 = require('web3');
import ULIFrameProvider from '../../../universal-login-provider/src';

describe('E2E: Dashboard', () => {
  ['macbook-13'].forEach((size) => {
    it(`Dashboard on ${size}`, () => {
      const ensName = Math.random().toString(36).substring(7);
      cy.viewport(size);
      cy.window().then((win) => {
        win.web3 = new Web3(ULIFrameProvider.createPicker('kovan'));
      })
      cy.initApplication();
      cy.clickReactButtonContainsText('Show dashboard').then(() => {console.log('DZIALA ', (cy.window()))});

      cy.window() // get a reference to application's `window`
      .then($window => {
        const message = 'some data here'
        $window.postMessage(message, '*')
      })
      // cy.wait(10000);
      // cy.get('#universal-login-web3-picker').find('.unilogin-component-modal').should('not.be.empty');

      // cy.ensureCorrectLocation('/terms');
      // cy.approveTerms();
      // cy.ensureCorrectLocation('/selectDeployName');
      // cy.pickUsername(ensName);
      // cy.get('.unilogin-component-waitingfor-action-title');
      // cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deploying');
      // cy.ensureCorrectLocation('/creationSuccess');
      // cy.goToDashboard();
      // cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deployed');
      // cy.goToTopUp();
      // cy.ensureCorrectLocation('/dashboard/topUp');
      // cy.selectFiat();
      // cy.waitForFiatDetails();
      // cy.selectCrypto();
      // cy.receiveCrypto();
      // cy.goToFunds();
      // cy.goToSend();
      // cy.sendEther();
      // cy.goToGenerateBackupCodes();
      // cy.generateBackupCodes();
      // cy.goToDevices();
      // cy.ensureCorrectLocation('/dashboard/devices');
      // cy.goToDisconnectAccount();
      // cy.ensureCorrectLocation('/dashboard/devices/disconnectAccount');
      // cy.deleteAccount(ensName, 'mylogin.eth');
    });
  });
});
