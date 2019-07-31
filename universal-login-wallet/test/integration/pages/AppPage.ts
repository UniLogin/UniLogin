import {ReactWrapper} from 'enzyme';
import LoginPage from '../pages/LoginPage';
import TransferPage from '../pages/TransferPage';
import DashboardPage from '../pages/DashboardPage';
import NotificationsPage from './Notifications';
import CreationFlow from './CreationFlow';
import ConnectionFlow from './ConnectionFlow';

export class AppPage {
  private loginPage?: LoginPage;
  private transferPage?: TransferPage;
  private dashboarPage?: DashboardPage;
  private notificationsPage?: NotificationsPage;
  private creationFlow?: CreationFlow;
  private connectionFlow?: ConnectionFlow;

  constructor(private wrapper: ReactWrapper) {
  }

  login(): LoginPage {
    this.loginPage = this.loginPage || new LoginPage(this.wrapper);
    return this.loginPage;
  }

  creation(): CreationFlow {
    this.creationFlow = this.creationFlow || new CreationFlow(this.wrapper);
    return this.creationFlow;
  }

  connection(): ConnectionFlow {
    this.connectionFlow = this.connectionFlow || new ConnectionFlow(this.wrapper);
    return this.connectionFlow;
  }

  transfer(): TransferPage {
    this.transferPage = this.transferPage || new TransferPage(this.wrapper);
    return this.transferPage;
  }

  dashboard(): DashboardPage {
    this.dashboarPage = this.dashboarPage || new DashboardPage(this.wrapper);
    return this.dashboarPage;
  }

  notifications(): NotificationsPage {
    this.notificationsPage = this.notificationsPage || new NotificationsPage(this.wrapper);
    return this.notificationsPage;
  }
}
