import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {RelayerUnderTest} from '../../../lib/index';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {messageSignature} from '../../../lib/utils/utils';
import Identity from 'universal-login-contracts/build/Identity';
import MockToken from 'universal-login-contracts/build/MockToken';
import defaultPaymentOptions from '../../../lib/config/defaultPaymentOptions';
import ethers, {utils} from 'ethers';

chai.use(chaiHttp);

describe('Relayer - Authorisation routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;
  let token;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    relayer.start();
    const result = await chai.request(relayer.server)
      .post('/identity')
      .send({
        managementKey: wallet.address,
        ensName: 'marek.mylogin.eth'
      });

    const {transaction} = result.body;
    expect(transaction.address).to.be.properAddress;
    contract = new ethers.Contract(transaction.address, Identity.interface, wallet);
    await wallet.send(contract.address, 100000);
    token = await deployContract(wallet, MockToken, []);
    await token.transfer(contract.address, utils.parseEther('1'));

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
  });

  it('Authorise', async () => {
    const result = await chai.request(relayer.server)
      .post('/authorisation')
      .send({
        identityAddress: contract.address,
        key: wallet.address,
        label: ' '
      });
    expect(result.status).to.eq(201);
  });

  it('get pending authorisations', async () => {
    const result = await chai.request(relayer.server)
      .get(`/authorisation/${contract.address}`);
    expect(result.body.response).to.deep.eq([{key: wallet.address, label: ' ', index: 0}]);
  });

  it('get non-existing pending authorisations', async () => {
    const result = await chai.request(relayer.server)
      .get(`/authorisation/${otherWallet.address}`);
    expect(result.status).to.eq(200);
    expect(result.body.response).to.deep.eq([]);
  });

  it('response status should be 201 when deny request', async () => {
    const result = await chai.request(relayer.server)
      .post(`/authorisation/${contract.address}`)
      .send({
        key: wallet.address
      });
    expect(result.status).to.eq(201);
  });
});
