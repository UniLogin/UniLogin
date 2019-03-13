import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import App from '../../src/ui/App';
import {configure, ReactWrapper} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {providers, utils, Contract} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {setupSdk} from 'universal-login-sdk/test';
import {Services} from '../../src/services/Services';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {sleep, waitUntil} from 'universal-login-commons';
import {mountWithRouterAndContextProvider} from '../helpers/CustomMount';
import {deployMockToken} from 'universal-login-commons/test';

configure({adapter: new Adapter()});

const hasChangedOn = (wrapper: ReactWrapper, message: any) => {
  wrapper.update();
  return wrapper.text().includes(message);
};

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let provider: providers.Web3Provider;
  let mockTokenContract: Contract;
  const amount = '1';
  const receiverAddress = '0x0000000000000000000000000000000000000001';

  before(async () => {
    ({relayer, provider} = await setupSdk());
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [mockTokenContract.address]);
    services.tokenService.start();
  });

  it('Creates wallet and transfers tokens', async () => {
    appWrapper = mountWithRouterAndContextProvider(<App/>, services, ['/', '/login']);
    const input = appWrapper.find('input');

    input.simulate('change', {target: {value: 'super-name'}});
    await waitUntil(hasChangedOn, 5, 3000, [appWrapper, 'create new']);

    appWrapper.find('.suggestions-item-btn').simulate('click');
    await waitUntil(hasChangedOn, 5, 2000, [appWrapper, 'You can spend']);

    const walletAddress = services.walletService.userWallet ? services.walletService.userWallet.contractAddress : '0x0'
    mockTokenContract.transfer(walletAddress, utils.parseEther('2.0'));
    
    appWrapper.find('.transfer-funds-button').simulate('click');
    appWrapper.update();

    const addressInput = appWrapper.find('.input-transfer-modal-address');
    const amountInput = appWrapper.find('.input-with-dropdown-transfer-modal-amount');

    addressInput.simulate('change', {target: {value: receiverAddress}});
    amountInput.simulate('change', {target: {value: '1'}})

    appWrapper.find('#transferButton').first().simulate('click');
    await sleep(300);

    expect(await mockTokenContract.balanceOf(receiverAddress)).to.deep.eq(utils.parseEther(amount));
  });

  after(() => {
    appWrapper.unmount();
    relayer.stop();
  })
});
