import {ReactWrapper} from 'enzyme';

export class BackupCodesPage {
  constructor(private wrapper: ReactWrapper) {}

  clickGenerate() {
    const button = this.wrapper.find('.unilogin-component-primary-button.backup-btn');
    button.simulate('click');
  }

  isGenerateButtonActive() {
    this.wrapper.update();
    const button = this.wrapper.find('.unilogin-component-primary-button.backup-btn');
    return !button.prop('disabled');
  }

  getBackupCodes() {
    this.wrapper.update();
    const backupCodes = this.wrapper.find('.backup-codes-item');
    return backupCodes;
  }
}
