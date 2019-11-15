import {expect} from 'chai';
import {WalletSerializer} from '../../../lib/core/services/WalletSerializer';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {DeployedWallet} from '../../../lib';
import {Wallet} from 'ethers';

describe('WalletSerializer', () => {
  const TEST_FUTURE_WALLET = {
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: (() => {}) as any,
    waitForBalance: (() => {}) as any,
  };

  const TEST_APPLICATION_WALLET = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };

  const TEST_DEPLOYED_WALLET = new DeployedWallet(
    TEST_CONTRACT_ADDRESS,
    'name.mylogin.eth',
    TEST_PRIVATE_KEY,
    {provider: Wallet.createRandom()} as any
  );

  describe('serialize', () => {
    const walletSerializer = new WalletSerializer({} as any);

    it('for None returns None', () => {
      expect(walletSerializer.serialize({kind: 'None'})).to.deep.eq({kind: 'None'});
    });

    it('for Future returns Future', () => {
      expect(walletSerializer.serialize({
        kind: 'Future',
        wallet: TEST_FUTURE_WALLET
      })).to.deep.eq({
        kind: 'Future',
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
        }
      });
    });

    it('for Deployed returns Deployed', () => {
      expect(walletSerializer.serialize({
        kind: 'Deployed',
        wallet: TEST_DEPLOYED_WALLET
      })).to.deep.eq({
        kind: 'Deployed',
        wallet: TEST_APPLICATION_WALLET
      })
    });

    it('for Deploying state return undefined', () => {
      expect(walletSerializer.serialize({
        kind: 'Deploying',
        wallet: TEST_APPLICATION_WALLET
      })).to.eq(undefined)
    });

    it('for Connecting state return undefined', () => {
      expect(walletSerializer.serialize({
        kind: 'Connecting',
        wallet: TEST_APPLICATION_WALLET
      })).to.eq(undefined)
    });
  });

  describe('deserialize', () =>  {
    const futureWalletFactory = {
      createFromExistingCounterfactual: () => TEST_FUTURE_WALLET,
    }
    const sdk = {
      getFutureWalletFactory: () => futureWalletFactory,
      provider: Wallet.createRandom(),
    }
    const walletSerializer = new WalletSerializer(sdk as any);

    it('for None returns None', async () => {
      expect(await walletSerializer.deserialize({kind: 'None'})).to.deep.eq({kind: 'None'});
    });

    it('for Future returns Future', async () => {
      expect(await walletSerializer.deserialize({
        kind: 'Future',
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
        }
      })).to.deep.eq({kind: 'Future', wallet: TEST_FUTURE_WALLET});
    });

    it('for Deployed returns Deployed', async () => {
      const state = await walletSerializer.deserialize({
        kind: 'Deployed',
        wallet: TEST_APPLICATION_WALLET
      });

      expect(state.kind).to.eq('Deployed')
      expect((state as any).wallet).to.deep.include(TEST_APPLICATION_WALLET)
    });
  })
});
