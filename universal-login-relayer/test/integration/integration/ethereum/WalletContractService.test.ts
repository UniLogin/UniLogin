import {expect} from 'chai';
import {providers, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {WalletContractService} from '../../../../src/integration/ethereum/WalletContractService';
import createWalletContract from '../../../helpers/createWalletContract';

describe('INT: WalletContractService', () => {
  let walletContractService: WalletContractService;
  let proxyContract: Contract;
  before(async () => {
    const provider = createMockProvider();
    const [wallet] = getWallets(provider);
    ({proxy: proxyContract} = await createWalletContract(wallet));
    walletContractService = new WalletContractService(provider);
  });

  it('returns required signatures number', async () => {
    const requiredSignatures = await proxyContract.requiredSignatures();
    console.log(requiredSignatures)
    expect(await walletContractService.getRequiredSignatures(proxyContract.address)).to.eq(requiredSignatures);
  });
});
