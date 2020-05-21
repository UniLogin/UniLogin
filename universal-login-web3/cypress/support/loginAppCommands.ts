Cypress.Commands.add('approveTerms', () => {
  cy.get('.terms-btn.button-primary').should('be.disabled');
  cy.get('#terms-label').find('[type="checkbox"]').check({ force: true }).should('be.checked');
  cy.get('#privacy-label').find('[type="checkbox"]').check({ force: true }).should('be.checked');
  cy.get('.terms-btn.button-primary').click();
});

Cypress.Commands.add('pickUsername', (name) => {
  cy.get('.unilogin-theme-jarvis.unilogin-component-wallet-selector-wrapper').find('#loginInput').type(name);
  cy.get('.unilogin-component-suggestions-list').first()
    .get('.unilogin-component-suggestions-ens-name')
    .get('p.unilogin-component-ens-name').contains(name);
  cy.get('.unilogin-component-suggestions-list').first().find('#create-new').click();
});

Cypress.Commands.add('selectTopUpWithCrypto', () => {
  cy.get('.unilogin-component-modal')
    .get('.unilogin-component-top-up-methods')
    .find('#topup-btn-crypto').click();
});

Cypress.Commands.add('topUpAccount', () => {
  cy.get('.unilogin-component-top-up-body')
    .get('.unilogin-component-top-up-row')
    .get('input[id="contract-address"]').then(input => cy.task('topUpAccount', input.val()));
});

Cypress.Commands.add('goToDashboard', () => {
  cy.get('.modal-success-btn').click();
  cy.get('.balance-amount').should('be.exist');
});
