import {providers, Wallet} from 'ethers';
import {utils} from 'ethers';
import {AppPage} from '../pages/AppPage';

const goToPage = (url) => {
  cy.visit(url);
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
}

const ensureCorrectLocation = (url) => {
  cy.location('pathname').should('eq', url);
}

describe('E2E: Create Account', () => {
  const provider = new providers.JsonRpcProvider('http://localhost:18545');
  const wallet = new Wallet('0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797', provider);

  it('Create account', async () => {
    const ensName = Math.random().toString(36).substring(7);
    const loginPage = new AppPage().login();
    goToPage('http://0.0.0.0:8080/');
    loginPage.create();
    ensureCorrectLocation('/terms');
    loginPage.approveTerms();
    ensureCorrectLocation('/selectDeployName');
    loginPage.pickUsername(ensName);
    ensureCorrectLocation('/create/topUp');
    loginPage.selectTopUpWithCrypto();
    const contractAddress = await loginPage.getContractAddress();
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    ensureCorrectLocation('/creationSuccess');
    loginPage.goToDashboard();
  });
});