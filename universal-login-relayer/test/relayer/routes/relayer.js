import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {RelayerUnderTest} from '../../../lib/index';
import {utils} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {waitForContractDeploy, messageSignature} from '../../../lib/utils/utils';
import Identity from 'universal-login-contracts/build/Identity';
import MockToken from 'universal-login-contracts/build/MockToken';
import defaultPaymentOptions from '../../../lib/config/defaultPaymentOptions';

chai.use(chaiHttp);

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
    let token;

    before(async () => {
      await wallet.send(contract.address, 100000);
      expectedBalance = (await otherWallet.getBalance()).add(10);
      token = await deployContract(wallet, MockToken, []);
      await token.transfer(contract.address, utils.parseEther('1'));
    });

    it('Execute signed transfer', async () => {
      const {gasPrice, gasLimit} = defaultPaymentOptions;
      const transferSignature = await messageSignature(wallet, otherWallet.address, contract.address, 10, '0x0', 0, token.address, gasPrice, gasLimit);
      await chai.request(relayer.server)
        .post('/identity/execution')
        .send({
          contractAddress: contract.address,
          to: otherWallet.address,
          value: 10,
          data: '0x0',
          nonce: 0,
          gasToken: token.address,
          gasPrice,
          gasLimit,
          signature: transferSignature
        });
      expect(await otherWallet.getBalance()).to.eq(expectedBalance);
    });
  });

  after(async () => {
    relayer.stop();
  });
});


