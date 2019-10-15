import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {setupSdk, createWallet} from '@universal-login/sdk/testutils';
import {DeployedWallet} from '@universal-login/sdk';
import {UDashboard} from '../../src/ui/UFlow/UDashboard';
import {waitExpect} from '@universal-login/commons';
import {Wallet, utils} from 'ethers';

describe('INT: UDashboard', () => {
  let wallet: Wallet;
  let deployedWallet: DeployedWallet;
  let contractAddress: string;
  let privateKey: string;
  const ensName = `jarek.mylogin.eth`;
  const initialAmount = `199.99`;

  beforeEach(async () => {
    ([wallet] = await getWallets(createMockProvider()));
    const {sdk} = await setupSdk(wallet, '33113');
    sdk.priceObserver.getCurrentPrices = () => {
      return Promise.resolve({ETH: {USD: 100, DAI: 99, ETH: 1}});
    };
    sdk.start();
    ({contractAddress, privateKey} = await createWallet(ensName, sdk, wallet));
    deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  });

  it('update usd balance amount', async () => {
    const appWrapper = mount(<UDashboard deployedWallet={deployedWallet} />);
    const uButton = appWrapper.find('.udashboard-logo-btn');
    uButton.simulate('click');
    const balanceComponent = appWrapper.find('.universal-login-balance-amount');
    await waitExpect(() => expect(balanceComponent.text()).to.be.eq(`$${initialAmount}`));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther(`2`)});
    await waitExpect(() => expect(balanceComponent.text()).to.be.eq(`$399.99`));
  });
});
