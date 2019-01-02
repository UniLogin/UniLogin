import {expect} from 'chai';
import EnsNameService from '../../src/services/EnsNameService';
import {getWallets, createMockProvider} from 'ethereum-waffle';


describe('EnsNameService', () => {
  let ensService;
  let provider;
  let ensNameService;
  let wallet;
  let historyService;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    historyService =  {
      pressers: [{address: wallet.address, name: wallet.address}]
    };
    ensService = {
      getEnsName() {
        return 'alice.mylogin.eth';
      }
    };
    ensNameService = new EnsNameService(ensService, historyService);
  });


  it('getENSName works', async () => {
    expect(await ensNameService.getEnsName(wallet.address)).to.eq('alice.mylogin.eth');
  });

  it('changePressersName works', async () => {
    expect(historyService.pressers[0].name).to.eq(wallet.address);
    await ensNameService.changePressersName();
    expect(historyService.pressers[0].name).to.eq('alice.mylogin.eth');
  });
});
