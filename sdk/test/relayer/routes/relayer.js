import chai from 'chai';
import chaiHttp from 'chai-http';
import IdentityService from '../../../lib/relayer/services/IdentityService';
import Relayer from '../../../lib/relayer/relayer';
import {createMockProvider, defaultAccounts, getWallets} from 'ethereum-waffle';
import {waitForContractDeploy, messageSignature} from '../../../lib/utils/utils';
import Identity from '../../../build/Identity';

chai.use(chaiHttp);

const {expect} = chai;
const privateKey = defaultAccounts[9].secretKey;

describe('Relayer - Identity routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let identityService;
  let contract;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    relayer = new Relayer(provider, {privateKey});
    relayer.start();
    identityService = new IdentityService(wallet);
  });

  it('Create', async () => {
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({
        managementKey: wallet.address
      });
    const {transaction} = result.body;
    const contract = await waitForContractDeploy(wallet, Identity, transaction.hash);
    expect(contract.address).to.be.properAddress;
  });

  describe('Execute', async () => {
    let expectedBalance;
    before(async () => {
      const transaction = await identityService.create(wallet.address);
      contract = await waitForContractDeploy(wallet, Identity, transaction.hash);
      await contract.setRequiredApprovals(0);
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
