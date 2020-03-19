import {LoginPage} from './LoginPage';

export class AppPage {
  loginPage: any | LoginPage;
  login(): LoginPage{
    this.loginPage = this.loginPage || new LoginPage();
    return this.loginPage;
  }
}