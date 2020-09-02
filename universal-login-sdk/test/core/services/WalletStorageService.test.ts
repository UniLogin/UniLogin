import {expect} from 'chai';
import sinon from 'sinon';
import {Wallet} from 'ethers';
import {ETHER_NATIVE_TOKEN, SerializableFutureWallet, TEST_GAS_PRICE, TEST_ENS_NAME, TEST_EMAIL, TEST_PRIVATE_KEY, TEST_CONTRACT_ADDRESS} from '@unilogin/commons';
import {IStorageService} from '../../../src/core/models/IStorageService';
import {WalletStorageService} from '../../../src/core/services/WalletStorageService';
import {MemoryStorageService} from '../../../src/core/services/MemoryStorageService';
import {TEST_STORAGE_KEY} from '../../helpers/constants';
import {SerializedDeployedWallet} from '../../../src/core/models/WalletService';

describe('WalletStorageService', () => {
  const baseWallet = {
    contractAddress: Wallet.createRandom().address,
    privateKey: Wallet.createRandom().privateKey,
  };

  const futureWallet: SerializableFutureWallet = {
    ...baseWallet,
    gasPrice: TEST_GAS_PRICE,
    ensName: TEST_ENS_NAME,
    gasToken: ETHER_NATIVE_TOKEN.address,
    email: TEST_EMAIL,
  };
  const serializedWallet: SerializedDeployedWallet = {
    name: 'name',
    email: TEST_EMAIL,
    ...baseWallet,
  };

  const setup = () => {
    const storage: IStorageService = {
      get: sinon.fake(),
      set: sinon.fake(),
      remove: sinon.fake(),
    };
    const service = new WalletStorageService(storage, 'ganache');
    return {storage, service};
  };

  it('returns None state by default', () => {
    const {storage, service} = setup();
    storage.get = sinon.fake.returns(null);
    expect(service.load()).to.deep.eq({kind: 'None'});
    expect(storage.get).to.be.calledWith(TEST_STORAGE_KEY);
  });

  it('can load deployed state', () => {
    const {storage, service} = setup();
    storage.get = sinon.fake.returns(JSON.stringify({kind: 'Deployed', wallet: serializedWallet}));
    expect(service.load()).to.deep.eq({kind: 'Deployed', wallet: serializedWallet});
    expect(storage.get).to.be.calledWith(TEST_STORAGE_KEY);
  });

  it('can load future state', () => {
    const {storage, service} = setup();
    storage.get = sinon.fake.returns(JSON.stringify({kind: 'Future', name: TEST_ENS_NAME, wallet: futureWallet}));
    expect(service.load()).to.deep.eq({kind: 'Future', name: TEST_ENS_NAME, wallet: futureWallet});
    expect(storage.get).to.be.calledWith(TEST_STORAGE_KEY);
  });

  it('sanitizes data', () => {
    const {storage, service} = setup();
    storage.get = sinon.fake.returns(JSON.stringify({foo: 'bar'}));
    expect(() => service.load()).to.throw;
  });

  it('can save data', () => {
    const {storage, service} = setup();
    service.save({kind: 'Deployed', wallet: serializedWallet});
    expect(storage.set).to.be.calledWith(TEST_STORAGE_KEY, JSON.stringify({kind: 'Deployed', wallet: serializedWallet}));
  });

  it('can migrate data from previous versions', async () => {
    const {storage, service} = setup();
    const previousDeployedState = {
      kind: 'Deployed',
      wallet: {
        name: 'test.unilogin.test',
        contractAddress: '0xCE824eA5d5a3810563B6e02114C66feFd0CaD13e',
        privateKey: '0xe7f0024cb894893c855d5ba516969cb4c40838762c0dd0e5e730bfd4aa27b719',
      },
    };
    let savedState = JSON.stringify(previousDeployedState);
    storage.get = sinon.fake((key: string) => key === 'wallet-mainnet' ? savedState : null);
    storage.set = sinon.fake((key: string, val: string) => {
      savedState = val;
    });
    const savedDeployedWithoutEmail = JSON.stringify({...previousDeployedState, kind: 'DeployedWithoutEmail'});
    await service.migrate();
    expect(storage.get).to.be.calledWith('wallet-mainnet');
    expect(storage.get).to.be.calledWith('wallet-kovan');
    expect(storage.get).to.be.calledWith('wallet-ropsten');
    expect(storage.get).to.be.calledWith('wallet-rinkeby');
    expect(storage.set).to.be.calledOnceWith('wallet-mainnet', savedDeployedWithoutEmail);
    expect(savedState).eq(savedDeployedWithoutEmail);
  });

  it('roundtrip', () => {
    const storage = new MemoryStorageService();
    const service = new WalletStorageService(storage, 'ganache');

    expect(service.load()).to.deep.eq({kind: 'None'});

    service.save({kind: 'Future', name: TEST_ENS_NAME, wallet: futureWallet});
    expect(service.load()).to.deep.eq({kind: 'Future', name: TEST_ENS_NAME, wallet: futureWallet});

    service.save({kind: 'Deployed', wallet: serializedWallet});
    expect(service.load()).to.deep.eq({kind: 'Deployed', wallet: serializedWallet});
  });

  it('saves and loads RequestedCreatingWallet', () => {
    const storage = new MemoryStorageService();
    const service = new WalletStorageService(storage, 'ganache');
    expect(service.load()).to.deep.eq({kind: 'None'});

    service.save({kind: 'RequestedCreating', wallet: {email: TEST_EMAIL, ensName: TEST_ENS_NAME}});
    expect(service.load()).to.deep.eq({kind: 'RequestedCreating', wallet: {email: TEST_EMAIL, ensName: TEST_ENS_NAME}});
  });

  it('saves and loads ConfirmedWallet', () => {
    const storage = new MemoryStorageService();
    const service = new WalletStorageService(storage, 'ganache');
    expect(service.load()).to.deep.eq({kind: 'None'});

    service.save({kind: 'Confirmed', wallet: {email: TEST_EMAIL, ensName: TEST_ENS_NAME, code: '123456'}});
    expect(service.load()).to.deep.eq({kind: 'Confirmed', wallet: {email: TEST_EMAIL, ensName: TEST_ENS_NAME, code: '123456'}});
  });

  it('saves and loads RequestedMigrating', () => {
    const storage = new MemoryStorageService();
    const service = new WalletStorageService(storage, 'ganache');
    expect(service.load()).to.deep.eq({kind: 'None'});
    const serializableRequestedMigratingWallet = {
      email: TEST_EMAIL,
      ensName: TEST_ENS_NAME,
      privateKey: TEST_PRIVATE_KEY,
      contractAddress: TEST_CONTRACT_ADDRESS,
    };
    service.save({kind: 'RequestedMigrating', wallet: serializableRequestedMigratingWallet});
    expect(service.load()).to.deep.eq({kind: 'RequestedMigrating', wallet: serializableRequestedMigratingWallet});
  });

  it('saves and loads ConfirmedMigratingWallet', () => {
    const storage = new MemoryStorageService();
    const service = new WalletStorageService(storage, 'ganache');
    expect(service.load()).to.deep.eq({kind: 'None'});
    const serializableConfirmedMigratingWallet = {
      email: TEST_EMAIL,
      ensName: TEST_ENS_NAME,
      code: '123456',
      privateKey: TEST_PRIVATE_KEY,
      contractAddress: TEST_CONTRACT_ADDRESS,
    };
    service.save({kind: 'ConfirmedMigrating', wallet: serializableConfirmedMigratingWallet});
    expect(service.load()).to.deep.eq({kind: 'ConfirmedMigrating', wallet: serializableConfirmedMigratingWallet});
  });
});
