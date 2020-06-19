import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {MockProvider} from 'ethereum-waffle';
import {utils} from 'ethers';
import {TEST_CONTRACT_ADDRESS, TEST_REFUND_PAYER} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSDK, {TransferService, DeployedWallet, Execution} from '@unilogin/sdk';
import {waitExpect} from '@unilogin/commons/testutils';
import {Transfer} from '../../src/ui/Transfer/Transfer';
import {setupDeployedWallet} from '../helpers/setupDeploymentWallet';
import {TransferPage} from '../helpers/pages/TransferPage';

describe('INT: Free Transfer', () => {
  let reactWrapper: ReactWrapper;

  const initSpy = sinon.spy();
  const successSpy = sinon.spy();

  let relayer: RelayerUnderTest;
  let deployedWallet: DeployedWallet;
  let sdk: UniLoginSDK;

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    initSpy();
    const {waitToBeSuccess} = await transfer();
    await waitToBeSuccess();
    successSpy();
  };

  before(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({deployedWallet, relayer, sdk} = await setupDeployedWallet(wallet, 'jarek.mylogin.eth', {apiKey: TEST_REFUND_PAYER.apiKey}));
    reactWrapper = mount(<Transfer
      transferService={new TransferService(deployedWallet)}
      onTransferTriggered={onTransferTriggered}
      sdk={sdk}
    />);
  });

  it('succeed free transfer', async () => {
    const senderBalanceBefore = await relayer.provider.getBalance(deployedWallet.contractAddress);
    const transferPage = new TransferPage(reactWrapper);
    await transferPage.chooseCurrency('ETH');
    transferPage.enterTransferAmount('1');
    transferPage.enterRecipient(TEST_CONTRACT_ADDRESS);
    expect(transferPage.gasModePage.isRendered()).to.be.false;
    await transferPage.waitForBalance();
    transferPage.transfer();
    await waitExpect(() => expect(initSpy).to.be.calledOnce);
    await waitExpect(() => expect(successSpy).to.be.calledOnce);
    expect(successSpy).calledImmediatelyAfter(initSpy);
    expect(await relayer.provider.getBalance(deployedWallet.contractAddress)).eq(senderBalanceBefore.sub(utils.parseEther('1')));
  });

  after(async () => {
    reactWrapper.unmount();
    sdk.stop();
    await relayer.stop();
  });
});
