/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    initApplication(): Chainable<Element>;
    ensureCorrectLocation(url: string): Chainable<Element>;
  }
}