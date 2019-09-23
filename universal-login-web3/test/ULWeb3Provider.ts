import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {waitExpect, waitUntil} from '@universal-login/commons';
import {providerFixture} from './fixtures/provider';

const loadFixture = createFixtureLoader();

describe('ULWeb3Provier', () => {
  it('send transaction triggers wallet creationg', async () => {
    const {web3, services} = await loadFixture(providerFixture);

    expect(services.uiController.showOnboarding.get()).to.be.false;

    web3.eth.sendTransaction({
      to: Wallet.createRandom().address,
      value: utils.parseEther('0.005').toString(),
    });

    await waitExpect(() => {
      return expect(services.uiController.showOnboarding.get()).to.be.true;
    });
  });
});
