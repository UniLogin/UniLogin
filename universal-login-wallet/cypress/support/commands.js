Cypress.Commands.add("initApplication", () => {
  cy.visit('');
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

Cypress.Commands.add("ensureCorrectLocation", (url) => {
  cy.location('pathname').should('eq', url);
});