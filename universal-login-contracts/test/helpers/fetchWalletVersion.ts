import {expect} from 'chai';
import {providers, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {getContractHash, WALLET_MASTER_VERSIONS} from '@universal-login/commons';
import WalletContract from '../../build/Wallet.json';
import {fetchWalletVersion} from '../../lib/fetchWalletVersion.js';
import walletAndProxy from '../fixtures/walletAndProxy';
import basicWalletAndProxy from '../fixtures/basicWalletAndProxy';

describe('fetchWalletVersion', () => {
  let provider: providers.Provider;
  let walletContractProxy: Contract;

  before(async () => {
    ({provider, walletContractProxy} = await loadFixture(walletAndProxy));
  });

  it('returns correct wallet contract version', async () => {
    const walletMasterBytecodeHash = getContractHash(WalletContract as any);
    expect(await fetchWalletVersion(walletContractProxy.address, provider)).to.eq((WALLET_MASTER_VERSIONS as any)[walletMasterBytecodeHash]);
  });

  it('throws error if wallet is not supported', async () => {
    const {provider, walletProxy} = await loadFixture(basicWalletAndProxy);
    expect(fetchWalletVersion(walletProxy.address, provider)).to.be.eventually.rejectedWith('Unsupported wallet master version');
  });
});
