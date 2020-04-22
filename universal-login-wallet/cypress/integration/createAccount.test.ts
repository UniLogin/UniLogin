import {sizes} from '../support/sizes';

describe('E2E: Create Account', () => {
  sizes.forEach((size) => {
    it(`Create account on ${size}`, () => {
      const ensName = Math.random().toString(36).substring(7);
      cy.viewport(size);
      cy.initApplication();
      cy.get('.welcome-box-create').click();
      cy.ensureCorrectLocation('/terms');
      cy.approveTerms();
      cy.wait(150);
      cy.ensureCorrectLocation('/selectDeployName');
      cy.pickUsername(ensName);
      cy.ensureCorrectLocation('/create/topUp');
      cy.selectTopUpWithCrypto();
      cy.topUpAccount();
      cy.ensureCorrectLocation('/creationSuccess');
      cy.goToDashboard();
    });
  });
});
