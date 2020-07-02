import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {MockProvider} from 'ethereum-waffle';
import {TEST_REFUND_PAYER} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {setupSdk} from '@unilogin/sdk/testutils';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {Onboarding} from '../../src/ui/Onboarding/Onboarding';
import {WalletSelectorPage} from '../helpers/pages/WalletSelectorPage';

describe('INT: Free Onboarding', () => {
  let reactWrapper: ReactWrapper;
  const createSpy = sinon.spy();
  let sdk: UniLoginSdk;
  let relayer: any;

  before(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({sdk, relayer} = await setupSdk(wallet, '33113', {apiKey: TEST_REFUND_PAYER.apiKey}));
    const walletService = new WalletService(sdk);

    reactWrapper = mount(<Onboarding
      walletService={walletService}
      domains={relayer.config.ensRegistrars}
      onCreate={() => createSpy()}
    />);
  });

  it('succeed free onboard', async () => {
    const walletSelectorPage = new WalletSelectorPage(reactWrapper);
    walletSelectorPage.typeName('alex');
    await walletSelectorPage.waitForSuggestions();
    walletSelectorPage.selectSuggestion('create new');
    await waitExpect(() => expect(createSpy).calledOnce, 2500);
  });

  after(async () => {
    reactWrapper.unmount();
    await relayer.stop();
  });
});
