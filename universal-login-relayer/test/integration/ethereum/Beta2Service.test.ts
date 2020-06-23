import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import createWalletContract from '../../testhelpers/createWalletContract';

describe('INT: Beta2Service', () => {
  let beta2Service: Beta2Service;
  let proxyContract: Contract;
  let wallet: Wallet;

  before(async () => {
    const provider = new MockProvider();
    [wallet] = provider.getWallets();
    ({proxy: proxyContract} = await createWalletContract(wallet));
    beta2Service = new Beta2Service(provider, {} as any);
  });

  it('returns required signatures number', async () => {
    const requiredSignatures = await proxyContract.requiredSignatures();
    expect(await beta2Service.getRequiredSignatures(proxyContract.address)).to.eq(requiredSignatures);
  });

  it('returns true if key exist', async () => {
    expect(await beta2Service.keyExist(proxyContract.address, wallet.address)).to.be.true;
  });

  it('returns false if key does not exist', async () => {
    expect(await beta2Service.keyExist(proxyContract.address, Wallet.createRandom().address)).to.be.false;
  });
});
