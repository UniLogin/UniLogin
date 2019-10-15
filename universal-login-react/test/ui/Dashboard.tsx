import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {DeployedWallet} from '@universal-login/sdk';
import {Dashboard} from '../../src/ui/UFlow/Dashboard';
import {waitExpect} from '@universal-login/commons';
import {Wallet, utils} from 'ethers';
import {DashboardReactWrapper} from '../helpers/wrappers/DashboardReactWrapper';
import {setupDeployedWallet} from '../helpers/setupDeploymentWallet';

describe('INT: Dashboard', () => {
  let wallet: Wallet;
  const ensName = `jarek.mylogin.eth`;
  const initialAmount = `199.99`;
  let deployedWallet: DeployedWallet;
  let dashboard: DashboardReactWrapper;

  beforeEach(async () => {
    ([wallet] = await getWallets(createMockProvider()));
    deployedWallet = await setupDeployedWallet(wallet, ensName);
    const appWrapper = mount(<Dashboard deployedWallet={deployedWallet} />);
    dashboard = new DashboardReactWrapper(appWrapper);
  });

  it('update usd balance amount', async () => {
    dashboard.clickInitButton();
    await waitExpect(() =>
      expect(dashboard.funds().getUsdBalance()).to.be.eq(`$${initialAmount}`)
    );
    await wallet.sendTransaction({
      to: deployedWallet.contractAddress,
      value: utils.parseEther(`2`)
    });
    await waitExpect(() =>
      expect(dashboard.funds().getUsdBalance()).to.be.eq(`$399.99`)
    );
  });
});
