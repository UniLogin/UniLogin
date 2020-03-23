declare namespace Cypress {
  interface Chainable {
    initApplication(): void;
    ensureCorrectLocation(url: string): void;
    approveTerms(): void;
    pickUsername(name: string): void;
    selectTopUpWithCrypto(): void;
    topUpAccount(): void;
    goToDashboard(): void;
  }
}
