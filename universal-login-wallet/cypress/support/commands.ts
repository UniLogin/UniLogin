Cypress.Commands.add('initApplication', () => {
  cy.visit('');
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

Cypress.Commands.add('ensureCorrectLocation', (url: string) => {
  cy.location('pathname').should('eq', url);
});

Cypress.Commands.add('getLocalStorage', (token) => {
  cy.window().then((window) => JSON.parse(window.localStorage.getItem(token)));
});

Cypress.Commands.add('checkLocalStorageTokenProp', (token, prop, value) => {
  cy.getLocalStorage(token).its('kind').should('eq', value);
});
