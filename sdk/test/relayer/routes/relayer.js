import chai from 'chai';
import chaiHttp from 'chai-http';
import RelayerUnderTest from '../../helpers/relayerUnderTest';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy, messageSignature} from '../../../lib/utils/utils';
import Identity from '../../../build/Identity';


chai.use(chaiHttp);

const {expect} = chai;

describe('Relayer - Identity routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    relayer.start();
  });

  it('Create', async () => {
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({
        managementKey: wallet.address,
        ensName: 'marek.mylogin.eth'
      });
    const {transaction} = result.body;
    contract = await waitForContractDeploy(wallet, Identity, transaction.hash);
    expect(contract.address).to.be.properAddress;
  });

  describe('Execute', async () => {
    let expectedBalance;
    before(async () => {
      await wallet.send(contract.address, 100000);
      expectedBalance = (await otherWallet.getBalance()).add(10);
    });

    it('Execute signed transfer', async () => {
      const transferSignature = await messageSignature(wallet, otherWallet.address, 10, '0x0');
      await chai.request(relayer.server)
        .post('/identity/execution')
        .send({
          contractAddress: contract.address,
          to: otherWallet.address,
          value: 10,
          data: '0x0',
          signature: transferSignature
        });
      expect(await otherWallet.getBalance()).to.eq(expectedBalance);
    });
  });

  after(async () => {
    relayer.stop();
  });
});
