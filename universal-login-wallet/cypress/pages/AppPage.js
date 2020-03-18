import {LoginPage} from './LoginPage';

export class AppPage {
  login() {
    this.loginPage = this.loginPage || new LoginPage();
    return this.loginPage;
  }
}