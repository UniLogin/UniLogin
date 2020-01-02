import {expect} from 'chai';
import {Contract, Wallet} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import createWalletContract from '../../testhelpers/createWalletContract';

describe('INT: WalletContractService', () => {
  let walletContractService: WalletContractService;
  let proxyContract: Contract;
  let wallet: Wallet;

  before(async () => {
    const provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({proxy: proxyContract} = await createWalletContract(wallet));
    walletContractService = new WalletContractService(provider);
  });

  it('returns required signatures number', async () => {
    const requiredSignatures = await proxyContract.requiredSignatures();
    expect(await walletContractService.getRequiredSignatures(proxyContract.address)).to.eq(requiredSignatures);
  });

  it('returns true if key exist', async () => {
    expect(await walletContractService.keyExist(proxyContract.address, wallet.address)).to.be.true;
  });

  it('returns false if key does not exist', async () => {
    expect(await walletContractService.keyExist(proxyContract.address, Wallet.createRandom().address)).to.be.false;
  });
});
