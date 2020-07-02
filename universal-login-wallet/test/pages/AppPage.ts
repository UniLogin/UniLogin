import {ReactWrapper} from 'enzyme';
import {GasModePage, TransferPage} from '@unilogin/react/testutils';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import NotificationsPage from './Notifications';
import CreationFlow from './CreationFlow';
import ConnectionFlow from './ConnectionFlow';

export class AppPage {
  private loginPage?: LoginPage;
  private transferPage?: TransferPage;
  private dashboardPage?: DashboardPage;
  private notificationsPage?: NotificationsPage;
  private creationFlow?: CreationFlow;
  private connectionFlow?: ConnectionFlow;
  private gasModePage?: GasModePage;

  constructor(private wrapper: ReactWrapper) {
  }

  login(): LoginPage {
    this.loginPage = this.loginPage || new LoginPage(this.wrapper);
    return this.loginPage;
  }

  creation(): CreationFlow {
    this.creationFlow = this.creationFlow || new CreationFlow(this.wrapper, this.gasMode());
    return this.creationFlow;
  }

  connection(): ConnectionFlow {
    this.connectionFlow = this.connectionFlow || new ConnectionFlow(this.wrapper);
    return this.connectionFlow;
  }

  transfer(): TransferPage {
    this.transferPage = this.transferPage || new TransferPage(this.wrapper, this.gasMode());
    return this.transferPage;
  }

  dashboard(): DashboardPage {
    this.dashboardPage = this.dashboardPage || new DashboardPage(this.wrapper);
    return this.dashboardPage;
  }

  notifications(): NotificationsPage {
    this.notificationsPage = this.notificationsPage || new NotificationsPage(this.wrapper, this.gasMode());
    return this.notificationsPage;
  }

  private gasMode(): GasModePage {
    this.gasModePage = this.gasModePage || new GasModePage(this.wrapper);
    return this.gasModePage;
  }
}
