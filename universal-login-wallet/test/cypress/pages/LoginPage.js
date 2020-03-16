export class LoginPage {
  create() {
    cy.get('.welcome-box-create').click();
  }

  approveTerms() {
    cy.get('.terms-btn.button-primary').should('be.disabled');
    cy.get('#terms-label').find('[type="checkbox"]').check({ force: true }).should('be.checked');
    cy.get('#privacy-label').find('[type="checkbox"]').check({ force: true }).should('be.checked');
    cy.get('.terms-btn.button-primary').click();
  }

  pickUsername(name) {
    cy.get('.unilogin-theme-jarvis.universal-login').find('#loginInput').type(name);
    cy.get('.unilogin-component-suggestions-list').first()
      .get('.unilogin-component-suggestions-ens-name')
      .get('p.unilogin-component-ens-name').contains(name);
    cy.get('.unilogin-component-suggestions-list').first().find('#create-new').click();
  }

  selectTopUpWithCrypto() {
    cy.get('.unilogin-component-modal')
      .get('.unilogin-component-top-up-methods')
      .find('#topup-btn-crypto').click();
  }

  getContractAddress() {
    return new Promise(resolve =>
      cy.get('.unilogin-component-top-up-body')
      .get('.unilogin-component-top-up-row')
      .get('input[id="contract-address"]').then(input => resolve(input.val())));
  }

  goToDashboard() {
    cy.get('.modal-success-btn').click();
  }
};
