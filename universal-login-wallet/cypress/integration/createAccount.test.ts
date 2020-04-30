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
      cy.get('.unilogin-component-waitingfor-action-title');
      cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deploying');
      cy.ensureCorrectLocation('/creationSuccess');
      cy.goToDashboard();
      cy.checkLocalStorageTokenProp('wallet-ganache', 'kind', 'Deployed');
    });
  });
});
