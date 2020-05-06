
Cypress.Commands.add('goToTopUp', () => {
  cy.get('.funds-topup').click();
});

Cypress.Commands.add('selectFiat', () => {
  cy.get('#topup-btn-fiat').click();
});

Cypress.Commands.add('waitForFiatDetails', () => {
  cy.get('.unilogin-component-top-up-radio-label').should('be.exist');
  cy.get('.unilogin-component-top-up-radio-label');
  cy.get('.unilogin-component-country-select-toggle').should('be.exist');
  cy.get('.unilogin-component-country-select-btn').should('be.exist');
  cy.get('.fiat-payment-methods').should('be.exist');
});

Cypress.Commands.add('selectCrypto', () => {
  cy.get('#topup-btn-crypto').click();
});

Cypress.Commands.add('receiveCrypto', () => {
  cy.get('#contract-address').then((address) => {
    cy.task('topUpAccount', address.val());
  });
});

Cypress.Commands.add('goToFunds', () => {
  cy.get('.header-funds-btn').click();
  cy.get('.balance-amount').should('be.exist');
});
