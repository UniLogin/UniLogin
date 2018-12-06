import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import RelayerUnderTest from '../../helpers/relayerUnderTest';
import {utils} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {waitForContractDeploy} from '../../../lib/utils/utils';
import calculateMessageSignature from 'universal-login-contracts/lib/calculateMessageSignature';
import Identity from 'universal-login-contracts/build/Identity';
import MockToken from 'universal-login-contracts/build/MockToken';
import {OPERATION_CALL} from 'universal-login-contracts';

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
    let token;

    before(async () => {
      await wallet.sendTransaction({to: contract.address, value: utils.parseEther('1.0')});
      token = await deployContract(wallet, MockToken, []);
      await token.transfer(contract.address, utils.parseEther('1.0'));
    });

    it('Execute signed transfer', async () => {
      const msg = {
        from: contract.address, 
        to: otherWallet.address, 
        value: 1000000000, 
        data: [], 
        nonce: 0, 
        gasToken: token.address, 
        gasPrice: 110000000, 
        gasLimit: 1000000, 
        operationType: OPERATION_CALL
      };
      const expectedBalance = (await otherWallet.getBalance()).add(msg.value);
      const signature = await calculateMessageSignature(wallet.privateKey, msg);
      await chai.request(relayer.server)
        .post('/identity/execution')
        .send({
          ...msg,
          signature
        });
      expect(await otherWallet.getBalance()).to.eq(expectedBalance);
    });
  });

  after(async () => {
    relayer.stop();
  });
});


