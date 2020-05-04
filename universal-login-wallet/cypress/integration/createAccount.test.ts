describe('E2E: Create Account', () => {
  ['macbook-13', 'iphone-x', 'iphone-5', 'ipad-2'].forEach((size) => {
    it(`Create account on ${size}`, () => {
      const ensName = Math.random().toString(36).substring(7);
      cy.viewport(size);
      cy.initApplication();
      cy.get('.welcome-box-create').click();
      cy.ensureCorrectLocation('/terms');
      cy.approveTerms();
      cy.ensureCorrectLocation('/selectDeployName');
      cy.pickUsername(ensName);
      cy.get('.unilogin-component-suggestions-item-btn').should('not.exist').then(() => {
        const wallet = JSON.parse(localStorage.getItem('wallet-ganache'));
        if (wallet.kind === 'Future') {
          cy.selectTopUpWithCrypto();
          cy.topUpAccount();
          cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Future');
          cy.ensureCorrectLocation('/creationSuccess');
          cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deployed');
        } else {
          cy.get('.unilogin-component-waitingfor-action-title');
          cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deploying');
          cy.ensureCorrectLocation('/creationSuccess');
          cy.goToDashboard();
          cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deployed');
        };
      });
    });
  });
});
