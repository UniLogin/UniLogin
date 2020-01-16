import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {DeployedWallet} from '@universal-login/sdk';
import {waitExpect} from '@universal-login/commons/testutils';
import {Wallet} from 'ethers';
import {DashboardPage} from '../helpers/pages/DashboardPage';
import {setupDeployedWallet} from '../helpers/setupDeploymentWallet';
import {Dashboard} from '../../src/ui/UFlow/Dashboard';
import Relayer from '@universal-login/relayer';

describe('INT: BackupCodes', () => {
  let wallet: Wallet;
  const ensName = 'jarek.mylogin.eth';
  let deployedWallet: DeployedWallet;
  let dashboard: DashboardPage;
  let relayer: Relayer;

  beforeEach(async () => {
    ([wallet] = await getWallets(createMockProvider()));
    ({deployedWallet, relayer} = await setupDeployedWallet(wallet, ensName));
    const appWrapper = mount(<Dashboard deployedWallet={deployedWallet} />);
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
      () => expect(dashboard.backupCodes().getBackupCodes().length).to.be.eq(1),
      13000,
    );
  }).timeout(15000);

  afterEach(async () => {
    deployedWallet.sdk.stop();
  });

  after(async () => {
    await relayer.stopLater();
  });
});
