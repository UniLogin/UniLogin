import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {MockProvider} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';
import {TEST_CONTRACT_ADDRESS} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSDK, {TransferService, DeployedWallet, Execution} from '@unilogin/sdk';
import {waitExpect} from '@unilogin/commons/testutils';
import {Transfer} from '../../src/ui/Transfer/Transfer';
import {setupDeployedWallet} from '../helpers/setupDeploymentWallet';
import {TransferPage} from '../helpers/pages/TransferPage';

describe('INT: Transfer with refund', () => {
  let reactWrapper: ReactWrapper;

  const initSpy = sinon.spy();
  const successSpy = sinon.spy();

  let relayer: RelayerUnderTest;
  let deployedWallet: DeployedWallet;
  let sdk: UniLoginSDK;
  let mockToken: Contract;

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    initSpy();
    const {waitToBeSuccess} = await transfer();
    await waitToBeSuccess();
    successSpy();
  };

  before(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({deployedWallet, relayer, sdk, mockToken} = await setupDeployedWallet(wallet, 'jarek.mylogin.eth'));
    reactWrapper = mount(<Transfer
      transferService={new TransferService(deployedWallet)}
      onTransferTriggered={onTransferTriggered}
      sdk={sdk}
    />);
  });

  it('succeed transfer of eth with token refund', async () => {
    const senderInitDaiBalance = utils.parseEther('5');
    const sendValue = '1';
    const expectedEthBalance = (await relayer.provider.getBalance(deployedWallet.contractAddress)).sub(utils.parseEther(sendValue));
    await mockToken.transfer(deployedWallet.contractAddress, senderInitDaiBalance);
    const transferPage = new TransferPage(reactWrapper);
    await transferPage.chooseCurrency('ETH');
    transferPage.enterTransferAmount(sendValue);
    transferPage.enterRecipient(TEST_CONTRACT_ADDRESS);
    await waitExpect(() => expect(transferPage.gasModePage.isRendered()).to.be.true);
    transferPage.gasModePage.selectGasMode(mockToken.address);
    await transferPage.waitForBalance();
    transferPage.transfer();
    await waitExpect(() => expect(initSpy).to.be.calledOnce);
    await waitExpect(() => expect(successSpy).to.be.calledOnce, 2000);
    expect(successSpy).calledImmediatelyAfter(initSpy);
    const senderDaiBalance = await mockToken.balanceOf(deployedWallet.contractAddress);
    expect(senderDaiBalance).below(senderInitDaiBalance);
    expect(await relayer.provider.getBalance(deployedWallet.contractAddress)).eq(expectedEthBalance);
  });

  after(async () => {
    reactWrapper.unmount();
    sdk.stop();
    await relayer.stop();
  });
});
