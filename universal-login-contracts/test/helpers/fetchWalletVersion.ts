import {expect} from 'chai';
import {providers, Contract} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {getContractHash, CONTRACT_VERSIONS} from '@universal-login/commons';
import WalletContract from '../../build/Wallet.json';
import {fetchWalletVersion} from '../../lib/fetchWalletVersion.js';
import walletAndProxy from '../fixtures/walletAndProxy';

describe('fetchWalletVersion', () => {
  let provider: providers.Provider;
  let walletContractProxy: Contract;

  before(async () => {
    ({provider, walletContractProxy} = await loadFixture(walletAndProxy));
  });

  it('returns correct wallet contract version', async () => {
    const walletMasterBytecodeHash = getContractHash(WalletContract as any);
    expect(await fetchWalletVersion(walletContractProxy.address, provider)).to.eq((CONTRACT_VERSIONS as any)[walletMasterBytecodeHash]);
  });
});
