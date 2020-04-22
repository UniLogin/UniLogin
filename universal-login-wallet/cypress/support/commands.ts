Cypress.Commands.add('initApplication', () => {
  cy.wait(100);
  cy.visit('/');
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

Cypress.Commands.add('ensureCorrectLocation', (url: string) => {
  cy.wait(500);
  cy.location('pathname').should('eq', url);
});
