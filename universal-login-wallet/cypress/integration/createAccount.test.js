import {providers, Wallet} from 'ethers';
import {utils} from 'ethers';
import {AppPage} from '../pages/AppPage';
import '../support/commands'

describe('E2E: Create Account', () => {
  const provider = new providers.JsonRpcProvider('http://localhost:18545');
  const wallet = new Wallet('0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797', provider);

  it('Create account', () => {
    const ensName = Math.random().toString(36).substring(7);
    const loginPage = new AppPage().login();
    cy.initApplication();
    loginPage.create();
    cy.ensureCorrectLocation('/terms');
    loginPage.approveTerms();
    cy.ensureCorrectLocation('/selectDeployName');
    loginPage.pickUsername(ensName);
    cy.ensureCorrectLocation('/create/topUp');
    loginPage.selectTopUpWithCrypto();
    const contractAddress = loginPage.getContractAddress();
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    cy.ensureCorrectLocation('/creationSuccess');
    loginPage.goToDashboard();
  });
});