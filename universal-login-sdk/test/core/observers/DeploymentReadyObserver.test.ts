import {expect} from 'chai';
import {utils} from 'ethers';
import {deployContract, MockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, sleep, BalanceChecker, ProviderService} from '@unilogin/commons';
import {mockContracts} from '@unilogin/contracts/testutils';
import {DeploymentReadyObserver} from '../../../src/core/observers/DeploymentReadyObserver';

describe('INT: DeploymentReadyObserver', () => {
  const MINIMAL_AMOUNT = '0.5';

  describe('ether', () => {
    async function setupEther() {
      const provider = new MockProvider();
      const [wallet] = provider.getWallets();

      const balanceChecker = new BalanceChecker(new ProviderService(provider));
      const deploymentReadyObserver = new DeploymentReadyObserver(
        ETHER_NATIVE_TOKEN.address,
        MINIMAL_AMOUNT,
        balanceChecker,
        1,
      );
      const cancel = () => {
        deploymentReadyObserver['isDeploymentReady'] = async () => true;
      };
      return {wallet, deploymentReadyObserver, cancel};
    }

    it('calls callback if ether balance changed', async () => {
      const {wallet, deploymentReadyObserver} = await setupEther();
      const promise = deploymentReadyObserver.waitForBalance(TEST_ACCOUNT_ADDRESS);

      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1.0')});

      await expect(promise).to.be.fulfilled;
    });

    it('shouldn`t call callback if ether balance is smaller than minimalAmount', async () => {
      const {wallet, deploymentReadyObserver, cancel} = await setupEther();
      const promise = deploymentReadyObserver.waitForBalance(TEST_ACCOUNT_ADDRESS);
      let fulfilled = false;
      promise.then(() => {fulfilled = true;});

      await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('0.49')});
      await sleep(100);
      expect(fulfilled).to.equal(false);

      cancel();
      await expect(promise).to.be.fulfilled;
    });
  });

  describe('token', () => {
    async function setupToken() {
      const provider = new MockProvider();
      const [wallet] = provider.getWallets();

      const mockToken = await deployContract(wallet, mockContracts.MockToken);

      const balanceChecker = new BalanceChecker(new ProviderService(provider));
      const deploymentReadyObserver = new DeploymentReadyObserver(
        mockToken.address,
        MINIMAL_AMOUNT,
        balanceChecker,
        1,
      );
      const cancel = () => {
        deploymentReadyObserver['isDeploymentReady'] = async () => true;
      };
      return {mockToken, deploymentReadyObserver, cancel};
    }

    it('calls callback if token balance changed', async () => {
      const {mockToken, deploymentReadyObserver} = await setupToken();
      const promise = deploymentReadyObserver.waitForBalance(TEST_ACCOUNT_ADDRESS);

      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('1.0'));

      await expect(promise).to.be.fulfilled;
    });

    it('shouldn`t call callback if token balance is smaller than minimalAmount', async () => {
      const {mockToken, deploymentReadyObserver, cancel} = await setupToken();
      const promise = deploymentReadyObserver.waitForBalance(TEST_ACCOUNT_ADDRESS);
      let fulfilled = false;
      promise.then(() => {fulfilled = true;});

      await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.49'));
      await sleep(100);
      expect(fulfilled).to.equal(false);

      cancel();
      await expect(promise).to.be.fulfilled;
    });
  });
});
