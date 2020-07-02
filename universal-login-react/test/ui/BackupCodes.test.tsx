import {expect} from 'chai';
import {mount, ReactWrapper} from 'enzyme';
import React from 'react';
import {MockProvider} from 'ethereum-waffle';
import {DeployedWallet} from '@unilogin/sdk';
import {waitExpect} from '@unilogin/commons/testutils';
import {Wallet} from 'ethers';
import {DashboardPage} from '../helpers/pages/DashboardPage';
import {setupDeployedWallet} from '../helpers/setupDeploymentWallet';
import {Dashboard} from '../../src/ui/UFlow/Dashboard';
import Relayer from '@unilogin/relayer';

describe('INT: BackupCodes', () => {
  let wallet: Wallet;
  const ensName = 'jarek.mylogin.eth';
  let deployedWallet: DeployedWallet;
  let dashboard: DashboardPage;
  let relayer: Relayer;
  let appWrapper: ReactWrapper;

  before(async () => {
    ([wallet] = new MockProvider().getWallets());
    ({deployedWallet, relayer} = await setupDeployedWallet(wallet, ensName));
    appWrapper = mount(<Dashboard deployedWallet={deployedWallet} />);
    dashboard = new DashboardPage(appWrapper);
  });

  it('generate backupCodes', async () => {
    dashboard.clickInitButton();
    dashboard.clickBackupCodesTab();
    await waitExpect(() => {
      expect(dashboard.backupCodes().isGenerateButtonActive()).to.be.true;
      expect(dashboard.getGasParameters()).to.have.length(1);
    });
    dashboard.backupCodes().clickGenerate();
    await waitExpect(
      () => expect(dashboard.backupCodes().getBackupCodes().length).to.eq(1),
      13000,
    );
  }).timeout(15000);

  after(async () => {
    appWrapper.unmount();
    await deployedWallet.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
