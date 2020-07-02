
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

Cypress.Commands.add('goToSend', () => {
  cy.get('#transferFunds').click();
});

Cypress.Commands.add('toggleCurrencyAccordion', () => {
  cy.get('.currency-accordion-btn').should('be.exist').click();
});

Cypress.Commands.add('typeSendAmount', (amount = 1) => {
  cy.get('#amount-eth').should('be.exist').type(amount);
});

Cypress.Commands.add('typeSendContractAddress', (address) => {
  cy.get('#input-recipient').should('be.exist').type(address);
});

Cypress.Commands.add('sendEther', () => {
  cy.toggleCurrencyAccordion();
  cy.toggleCurrencyAccordion();
  cy.typeSendAmount();
  cy.typeSendContractAddress('0x29709b7d78d49D7a51bE2eE091fba3b80F1C5D68');
  cy.get('#send-button', {timeout: 10000}).should('be.exist');
  cy.get('#send-button', {timeout: 20000}).should('not.disabled').click();
  cy.get('.unilogin-component-waitingfortransaction-txn-hash-text', {timeout: 15000}).should('not.exist');
  cy.get('.balance-amount', {timeout: 5000}).should('be.exist');
});
