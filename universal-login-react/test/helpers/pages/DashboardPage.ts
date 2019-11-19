import {ReactWrapper} from 'enzyme';
import {FundsPage} from './FundsPage';
import {BackupCodesPage} from './BackupCodesPage';

export class DashboardPage {
  private fundsPage?: FundsPage;
  private backupCodesPage?: BackupCodesPage;

  constructor(private wrapper: ReactWrapper) {}

  funds(): FundsPage {
    this.fundsPage = this.fundsPage ?? new FundsPage(this.wrapper);
    return this.fundsPage;
  }

  backupCodes(): BackupCodesPage {
    this.backupCodesPage = this.backupCodesPage ?? new BackupCodesPage(this.wrapper);
    return this.backupCodesPage;
  }

  clickInitButton() {
    const uButton = this.wrapper.find('.udashboard-logo-btn');
    uButton.simulate('click');
  }

  clickBackupCodesTab() {
    const backupLink = this.wrapper.find('a.udashboard-tab-backup').first();
    backupLink.simulate('click', {button: 0});
  }

  getGasParameters() {
    return this.wrapper.find('.transaction-fee-amount');
  }
}
