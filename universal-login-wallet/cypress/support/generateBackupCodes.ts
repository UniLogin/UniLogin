Cypress.Commands.add('goToGenerateBackupCodes', (token, prop, value) => {
  cy.get('.header-backup-btn').click();
});

Cypress.Commands.add('generateBackupCodes', (token, prop, value) => {
  cy.get('.generate-code-btn').click();
  cy.get('.generate-code-btn', {timeout: 15000}).should('not.exist');
  cy.get('.unilogin-component-waitingfortransaction-txn-hash-text', {timeout: 30000}).should('not.exist');
  cy.get('.backup-code').should('be.exist');
});
