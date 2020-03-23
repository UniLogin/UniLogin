describe('E2E: Create Account', () => {

  it('Create account', () => {
    const ensName = Math.random().toString(36).substring(7);
    cy.initApplication();
    cy.get('.welcome-box-create').click();
    cy.ensureCorrectLocation('/terms');
    cy.approveTerms();
    cy.ensureCorrectLocation('/selectDeployName');
    cy.pickUsername(ensName);
    cy.ensureCorrectLocation('/create/topUp');
    cy.selectTopUpWithCrypto();
    cy.topUpAccount();
    cy.ensureCorrectLocation('/creationSuccess');
    cy.goToDashboard();
  });
});
