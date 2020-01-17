import {expect} from 'chai';
import {Wallet, Contract, providers} from 'ethers';
import {getWallets, loadFixture} from 'ethereum-waffle';
import {createKeyPair, KeyPair} from '@universal-login/commons';
import {GnosisSafeInterface} from '../../../src/gnosis-safe@1.1.1/interfaces';
import {executeAddKey, executeRemoveKey, setupGnosisSafeContractFixture} from '../../fixtures/gnosisSafe';

describe('INT: executeHelpers', async () => {
  let wallet: Wallet;
  let proxy: Contract;
  let proxyAsGnosisSafe: Contract;
  let keyPair: KeyPair;
  let provider: providers.Provider;

  beforeEach(async () => {
    ({proxy, keyPair, provider} = await loadFixture(setupGnosisSafeContractFixture));
    [wallet] = getWallets(provider);
    proxyAsGnosisSafe = new Contract(proxy.address, GnosisSafeInterface, wallet.provider);
  });

  it('adding key works', async () => {
    const keyPair2 = createKeyPair();
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.false;
    await executeAddKey(wallet, proxyAsGnosisSafe.address, keyPair2.publicKey, keyPair.privateKey);
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.true;
  });

  it('removes key', async () => {
    const keyPair2 = createKeyPair();
    await executeAddKey(wallet, proxyAsGnosisSafe.address, keyPair2.publicKey, keyPair.privateKey);
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.true;
    await executeRemoveKey(wallet, proxyAsGnosisSafe.address, keyPair2.publicKey, [keyPair.privateKey, keyPair2.privateKey]);
    expect(await proxyAsGnosisSafe.isOwner(keyPair2.publicKey)).to.be.false;
  });
});
