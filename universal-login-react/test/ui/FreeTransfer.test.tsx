import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {utils} from 'ethers';
import {TEST_CONTRACT_ADDRESS, TEST_REFUND_PAYER} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSDK, {TransferService, DeployedWallet} from '@unilogin/sdk';
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

  const onTransferTriggered = async (transfer: any) => {
    initSpy();
    const {waitToBeSuccess} = await transfer();
    await waitToBeSuccess();
    successSpy();
  };

  before(async () => {
    const [wallet] = getWallets(createMockProvider());
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
    transferPage.enterTransferAmount('0.5');
    transferPage.enterRecipient(TEST_CONTRACT_ADDRESS);
    expect(transferPage.gasModePage.isRendered()).to.be.false;
    transferPage.transfer();
    expect(initSpy).to.be.calledOnce;
    expect(successSpy).to.be.calledOnce;
    expect(successSpy).calledImmediatelyAfter(initSpy);
    expect(await relayer.provider.getBalance(deployedWallet.contractAddress)).eq(senderBalanceBefore.sub(utils.parseEther('0.5')));
  });

  after(async () => {
    sdk.stop();
    await relayer.stop();
  });
});
