import {AssertionError, expect} from 'chai';
import sinon from 'sinon';
import {WalletSerializer} from '../../../src/core/services/WalletSerializer';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_MESSAGE_HASH, ensure, TEST_TRANSACTION_HASH, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, TEST_ENCRYPTED_WALLET_JSON} from '@unilogin/commons';
import {DeployedWallet, DeployingWallet, FutureWallet} from '../../../src';
import {Wallet} from 'ethers';
import {ConnectingWallet} from '../../../src/api/wallet/ConnectingWallet';
import {RestoringWallet} from '../../../src/api/wallet/RestoringWallet';
import {RequestedRestoringWallet} from '../../../src/api/wallet/RequestedRestoringWallet';

describe('UNIT: WalletSerializer', () => {
  const mockSDK = {
    provider: Wallet.createRandom(),
    relayerApi: {
      getDeploymentHash: sinon.stub().resolves({transactionHash: TEST_TRANSACTION_HASH, state: 'Success'}),
    },
    config: {
      mineableFactoryTick: 10,
      mineableFactoryTimeout: 100,
    },
  } as any;

  const TEST_FUTURE_WALLET: FutureWallet = {
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    ensName: 'name.mylogin.eth',
    gasPrice: TEST_GAS_PRICE,
    gasToken: ETHER_NATIVE_TOKEN.address,
    deploy: (() => {}) as any,
    waitForBalance: (() => {}) as any,
  } as any;

  const TEST_APPLICATION_WALLET = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };

  const TEST_SERIALIZED_WALLET = {
    name: 'name.mylogin.eth',
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploymentHash: TEST_MESSAGE_HASH,
  };

  const TEST_DEPLOYING_WALLET = new DeployingWallet(
    TEST_SERIALIZED_WALLET,
    mockSDK,
  );

  const TEST_DEPLOYED_WALLET = new DeployedWallet(
    TEST_CONTRACT_ADDRESS,
    'name.mylogin.eth',
    TEST_PRIVATE_KEY,
    mockSDK,
  );

  const TEST_CONNECTING_WALLET = new ConnectingWallet(TEST_CONTRACT_ADDRESS, 'name.mylogin.eth', TEST_PRIVATE_KEY, {} as any);

  const TEST_SERIALIZED_RESTORING = {
    encryptedWallet: TEST_ENCRYPTED_WALLET_JSON,
    contractAddress: TEST_CONTRACT_ADDRESS,
    ensName: 'name.mylogin.eth',
  };

  const TEST_RESTORING_WALLET = new RestoringWallet(TEST_ENCRYPTED_WALLET_JSON, 'name.mylogin.eth', TEST_CONTRACT_ADDRESS, mockSDK);

  const TEST_REQUESTED_RESTORING = new RequestedRestoringWallet(mockSDK, 'name.mylogin.eth');

  const TEST_SERIALIZED_REQUESTED_RESTORING_WALLET = {
    ensNameOrEmail: 'name.mylogin.eth',
  };

  describe('serialize', () => {
    const walletSerializer = new WalletSerializer(mockSDK);

    it('for None returns None', () => {
      expect(walletSerializer.serialize({kind: 'None'})).to.deep.eq({kind: 'None'});
    });

    it('for Future returns Future', () => {
      expect(walletSerializer.serialize({
        kind: 'Future',
        name: 'name.mylogin.eth',
        wallet: TEST_FUTURE_WALLET,
      })).to.deep.eq({
        kind: 'Future',
        name: 'name.mylogin.eth',
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
          ensName: 'name.mylogin.eth',
          gasPrice: TEST_GAS_PRICE,
          gasToken: ETHER_NATIVE_TOKEN.address,
        },
      });
    });

    it('for Deployed returns Deployed', () => {
      expect(walletSerializer.serialize({
        kind: 'Deployed',
        wallet: TEST_DEPLOYED_WALLET,
      })).to.deep.eq({
        kind: 'Deployed',
        wallet: TEST_APPLICATION_WALLET,
      });
    });

    it('for Deploying state returns Deploying', () => {
      expect(walletSerializer.serialize({
        kind: 'Deploying',
        wallet: TEST_DEPLOYING_WALLET,
      })).to.deep.eq({
        kind: 'Deploying',
        wallet: TEST_SERIALIZED_WALLET,
      });
    });

    it('for Connecting state returns Connecting', () => {
      expect(walletSerializer.serialize({
        kind: 'Connecting',
        wallet: TEST_CONNECTING_WALLET,
      })).to.deep.eq({
        kind: 'Connecting',
        wallet: TEST_APPLICATION_WALLET,
      });
    });

    it('for Restoring state returns Restoring', () => {
      expect(walletSerializer.serialize({
        kind: 'Restoring',
        wallet: TEST_RESTORING_WALLET,
      })).to.deep.eq({
        kind: 'Restoring',
        wallet: TEST_SERIALIZED_RESTORING,
      });
    });

    it('for RequestedRestoring state returns Restoring', () => {
      expect(walletSerializer.serialize({
        kind: 'RequestedRestoring',
        wallet: TEST_REQUESTED_RESTORING,
      })).to.deep.eq({
        kind: 'RequestedRestoring',
        wallet: TEST_SERIALIZED_REQUESTED_RESTORING_WALLET,
      });
    });
  });

  describe('deserialize', () => {
    const futureWalletFactory = {
      createFrom: () => TEST_FUTURE_WALLET,
    };
    const sdk = {
      ...mockSDK,
      getFutureWalletFactory: () => futureWalletFactory,
    };
    const walletSerializer = new WalletSerializer(sdk as any);

    it('for None returns None', () => {
      expect(walletSerializer.deserialize({kind: 'None'})).to.deep.eq({kind: 'None'});
    });

    it('for Future returns Future', () => {
      expect(walletSerializer.deserialize({
        kind: 'Future',
        name: 'name.mylogin.eth',
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
          ensName: 'name.mylogin.eth',
          gasPrice: TEST_GAS_PRICE,
          gasToken: ETHER_NATIVE_TOKEN.address,
        },
      })).to.deep.eq({
        kind: 'Future',
        name: 'name.mylogin.eth',
        wallet: TEST_FUTURE_WALLET,
      });
    });

    it('for Deploying returns Deploying', () => {
      const state = walletSerializer.deserialize({
        kind: 'Deploying',
        wallet: {
          ...TEST_APPLICATION_WALLET,
          deploymentHash: TEST_DEPLOYING_WALLET.deploymentHash,
        },
      });
      ensure(state.kind === 'Deploying', AssertionError, `Expected state.kind to be 'Deploying', but was ${state.kind}`);
      expect(state.wallet).to.deep.include({
        ...TEST_APPLICATION_WALLET,
        deploymentHash: TEST_DEPLOYING_WALLET.deploymentHash,
      });
      expect(state.wallet).to.haveOwnProperty('waitForTransactionHash');
      expect(state.wallet).to.haveOwnProperty('waitToBeSuccess');
    });

    it('for Deployed returns Deployed', () => {
      const state = walletSerializer.deserialize({
        kind: 'Deployed',
        wallet: TEST_APPLICATION_WALLET,
      });

      expect(state.kind).to.eq('Deployed');
      expect((state as any).wallet).to.deep.include(TEST_APPLICATION_WALLET);
    });

    it('for Restoring returns Restoring', () => {
      const state = walletSerializer.deserialize({
        kind: 'Restoring',
        wallet: TEST_SERIALIZED_RESTORING,
      });
      expect(state.kind).to.eq('Restoring');
      expect((state as any).wallet).to.to.be.an.instanceof(RestoringWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_RESTORING);
    });

    it('for RequestedRestoring returns RequestedRestoring', () => {
      const state = walletSerializer.deserialize({
        kind: 'RequestedRestoring',
        wallet: TEST_SERIALIZED_REQUESTED_RESTORING_WALLET,
      });
      expect(state.kind).to.eq('RequestedRestoring');
      expect((state as any).wallet).to.to.be.an.instanceof(RequestedRestoringWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_REQUESTED_RESTORING_WALLET);
    });
  });
});
