import {AssertionError, expect} from 'chai';
import sinon from 'sinon';
import {WalletSerializer} from '../../../src/core/services/WalletSerializer';
import {TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_MESSAGE_HASH, TEST_ENS_NAME, TEST_EMAIL, ensure, TEST_TRANSACTION_HASH, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, TEST_ENCRYPTED_WALLET_JSON} from '@unilogin/commons';
import {DeployedWallet, DeployingWallet, FutureWallet} from '../../../src';
import {Wallet} from 'ethers';
import {ConnectingWallet} from '../../../src/api/wallet/ConnectingWallet';
import {RestoringWallet} from '../../../src/api/wallet/RestoringWallet';
import {RequestedRestoringWallet} from '../../../src/api/wallet/RequestedRestoringWallet';
import {RequestedMigratingWallet} from '../../../src/api/wallet/RequestedMigrating';
import {ConfirmedMigratingWallet} from '../../../src/api/wallet/ConfirmedMigratingWallet';

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
    ensName: TEST_ENS_NAME,
    gasPrice: TEST_GAS_PRICE,
    gasToken: ETHER_NATIVE_TOKEN.address,
    email: TEST_EMAIL,
    deploy: (() => {}) as any,
    waitForBalance: (() => {}) as any,
  } as any;

  const TEST_APPLICATION_WALLET = {
    name: TEST_ENS_NAME,
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
  };

  const TEST_SERIALIZED_DEPLOYED_WALlET = {
    ...TEST_APPLICATION_WALLET,
    email: TEST_EMAIL,
  };

  const TEST_SERIALIZED_DEPLOYING_WALLET = {
    name: TEST_ENS_NAME,
    contractAddress: TEST_CONTRACT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploymentHash: TEST_MESSAGE_HASH,
    email: TEST_EMAIL,
  };

  const TEST_DEPLOYING_WALLET = new DeployingWallet(
    TEST_SERIALIZED_DEPLOYING_WALLET,
    mockSDK,
  );

  const TEST_DEPLOYED_WALLET = new DeployedWallet(
    TEST_CONTRACT_ADDRESS,
    TEST_ENS_NAME,
    TEST_PRIVATE_KEY,
    mockSDK,
    TEST_EMAIL,
  );

  const TEST_CONNECTING_WALLET = new ConnectingWallet(TEST_CONTRACT_ADDRESS, TEST_ENS_NAME, TEST_PRIVATE_KEY, {} as any);

  const TEST_SERIALIZED_RESTORING = {
    encryptedWallet: TEST_ENCRYPTED_WALLET_JSON,
    contractAddress: TEST_CONTRACT_ADDRESS,
    ensName: TEST_ENS_NAME,
    email: TEST_EMAIL,
  };

  const TEST_RESTORING_WALLET = new RestoringWallet(TEST_ENCRYPTED_WALLET_JSON, TEST_EMAIL, TEST_ENS_NAME, TEST_CONTRACT_ADDRESS, mockSDK);

  const TEST_REQUESTED_RESTORING = new RequestedRestoringWallet(mockSDK, TEST_ENS_NAME);

  const TEST_SERIALIZED_REQUESTED_RESTORING_WALLET = {
    ensNameOrEmail: TEST_ENS_NAME,
  };

  const TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET = {
    email: 'name@gmail.com',
    ensName: 'name.unilogin.eth',
    privateKey: '0x123',
    contractAddress: '0x123',
  };

  const TEST_SERIALIZED_CONFIRMED_MIGRATING_WALLET = {...TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET, code: '123456'};

  const TEST_REQUESTED_MIGRATING = new RequestedMigratingWallet('0x123', )

  describe('serialize', () => {
    const walletSerializer = new WalletSerializer(mockSDK);

    it('for None returns None', () => {
      expect(walletSerializer.serialize({kind: 'None'})).to.deep.eq({kind: 'None'});
    });

    it('for Future returns Future', () => {
      expect(walletSerializer.serialize({
        kind: 'Future',
        name: TEST_ENS_NAME,
        wallet: TEST_FUTURE_WALLET,
      })).to.deep.eq({
        kind: 'Future',
        name: TEST_ENS_NAME,
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
          ensName: TEST_ENS_NAME,
          gasPrice: TEST_GAS_PRICE,
          gasToken: ETHER_NATIVE_TOKEN.address,
          email: TEST_EMAIL,
        },
      });
    });

    it('for Deployed returns Deployed', () => {
      expect(walletSerializer.serialize({
        kind: 'Deployed',
        wallet: TEST_DEPLOYED_WALLET,
      })).to.deep.eq({
        kind: 'Deployed',
        wallet: TEST_SERIALIZED_DEPLOYED_WALlET,
      });
    });

    it('for DeployedWithoutEmail returns DeployedWithoutEmail', () => {
      expect(walletSerializer.serialize({
        kind: 'DeployedWithoutEmail',
        wallet: TEST_DEPLOYED_WALLET,
      })).to.deep.eq({
        kind: 'DeployedWithoutEmail',
        wallet: TEST_APPLICATION_WALLET,
      });
    });

    it('for Deploying state returns Deploying', () => {
      expect(walletSerializer.serialize({
        kind: 'Deploying',
        wallet: TEST_DEPLOYING_WALLET,
      })).to.deep.eq({
        kind: 'Deploying',
        wallet: TEST_SERIALIZED_DEPLOYING_WALLET,
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

    it('for RequestedMigrating returns RequestedMigrating', () => {
      expect(walletSerializer.serialize({
        kind: 'RequestedMigrating',
        wallet: TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET,
      })).to.deep.eq({
        kind: 'RequestedMigrating',
        wallet: TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET,
      });

      const state = walletSerializer.deserialize({
        kind: 'RequestedMigrating',
        wallet: TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET,
      });
      expect(state.kind).to.eq('RequestedMigrating');
      expect((state as any).wallet).to.to.be.an.instanceof(RequestedMigratingWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET);
    });

    it('for ConfirmedMigrating returns ConfirmedMigrating', () => {
      const state = walletSerializer.deserialize({
        kind: 'ConfirmedMigrating',
        wallet: TEST_SERIALIZED_CONFIRMED_MIGRATING_WALLET,
      });
      expect(state.kind).to.eq('ConfirmedMigrating');
      expect((state as any).wallet).to.to.be.an.instanceof(ConfirmedMigratingWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_CONFIRMED_MIGRATING_WALLET);
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
        name: TEST_ENS_NAME,
        wallet: {
          contractAddress: TEST_CONTRACT_ADDRESS,
          privateKey: TEST_PRIVATE_KEY,
          ensName: TEST_ENS_NAME,
          gasPrice: TEST_GAS_PRICE,
          gasToken: ETHER_NATIVE_TOKEN.address,
          email: TEST_EMAIL,
        },
      })).to.deep.eq({
        kind: 'Future',
        name: TEST_ENS_NAME,
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
        wallet: TEST_SERIALIZED_DEPLOYED_WALlET,
      });

      expect(state.kind).to.eq('Deployed');
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_DEPLOYED_WALlET);
    });

    it('for DeployedWithoutEmail returns DeployedWithoutEmail', () => {
      const state = walletSerializer.deserialize({
        kind: 'DeployedWithoutEmail',
        wallet: TEST_APPLICATION_WALLET,
      });

      expect(state.kind).to.eq('DeployedWithoutEmail');
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

    it('for RequestedMigrating returns RequestedMigrating', () => {
      const state = walletSerializer.deserialize({
        kind: 'RequestedMigrating',
        wallet: TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET,
      });
      expect(state.kind).to.eq('RequestedMigrating');
      expect((state as any).wallet).to.to.be.an.instanceof(RequestedMigratingWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_REQUESTED_MIGRATING_WALLET);
    });

    it('for ConfirmedMigrating returns ConfirmedMigrating', () => {
      const state = walletSerializer.deserialize({
        kind: 'ConfirmedMigrating',
        wallet: TEST_SERIALIZED_CONFIRMED_MIGRATING_WALLET,
      });
      expect(state.kind).to.eq('ConfirmedMigrating');
      expect((state as any).wallet).to.to.be.an.instanceof(ConfirmedMigratingWallet);
      expect((state as any).wallet).to.deep.include(TEST_SERIALIZED_CONFIRMED_MIGRATING_WALLET);
    });
  });
});
