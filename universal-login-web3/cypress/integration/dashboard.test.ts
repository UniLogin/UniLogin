/// <reference types="cypress" />

describe('E2E: Dashboard', () => {
  ['macbook-13'].forEach((size) => {
    it(`Dashboard on ${size}`, () => {
      const ensName = Math.random().toString(36).substring(7);
      cy.viewport(size);
      cy.initApplication();
      cy.clickReactButtonContainsText('Show dashboard');
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
