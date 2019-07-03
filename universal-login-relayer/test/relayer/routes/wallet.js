import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {OPERATION_CALL, waitForContractDeploy, createSignedMessage, waitExpect} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import MockToken from '@universal-login/contracts/build/MockToken';
import {startRelayer} from './helpers';

chai.use(chaiHttp);

describe('E2E: Relayer - WalletContract routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;
  let deployer;

  before(async () => {
    ({provider, wallet, otherWallet, relayer, deployer} = await startRelayer());
  });

  it('Create', async () => {
    const result = await chai.request(relayer.server)
      .post('/wallet')
      .send({
        managementKey: wallet.address,
        ensName: 'marek.mylogin.eth',
      });
    const {transaction} = result.body;
    expect(result.status).to.eq(201);
    contract = await waitForContractDeploy(provider, WalletContract, transaction.hash);
    expect(contract.address).to.be.properAddress;
  });

  it('Failed to create (invalid domain)', async () => {
    const result = await chai.request(relayer.server)
      .post('/wallet')
      .send({
        managementKey: wallet.address,
        ensName: 'marek.non-existing.eth',
      });
    const {status, body: {type, error}} = result;
    expect(status).to.eq(404);
    expect(type).to.eq('NotFound');
    expect(error).to.eq('Error: ENS domain marek.non-existing.eth does not exist or is not compatible with Universal Login');
  });

  describe('Execute', async () => {
    let token;

    before(async () => {
      await deployer.sendTransaction({to: contract.address, value: utils.parseEther('1.0')});
      token = await deployContract(deployer, MockToken, []);
      await token.transfer(contract.address, utils.parseEther('1.0'));
    });

    it('Execute signed transfer', async () => {
      const msg = {
        from: contract.address,
        to: otherWallet.address,
        value: 1000000000,
        data: [],
        nonce: '0',
        gasToken: token.address,
        gasPrice: 110000000,
        gasLimit: 1000000,
        operationType: OPERATION_CALL,
      };
      const balanceBefore = await provider.getBalance(otherWallet.address);
      const signedMessage = await createSignedMessage(msg, wallet.privateKey);
      const {status, body} = await chai.request(relayer.server)
        .post('/wallet/execution')
        .send(signedMessage);
      expect(status).to.eq(201);
      await waitExpect(async () => expect(await provider.getBalance(otherWallet.address)).to.eq(balanceBefore.add(msg.value)));
      const checkStatusId = async () => {
        const statusById = await chai.request(relayer.server)
          .get(`/wallet/execution/status/${body.transaction}`);
        expect(statusById.body.transactionHash).to.not.be.null;
      };
      await waitExpect(() => checkStatusId());
    });
  });

  it('Execution returns 400 if validations fails', async () => {
    const message = {
      to: '0x63FC2aD3d021a4D7e64323529a55a9442C444dA0',
      value: '500000000000000000',
      data: '0x0',
      nonce: utils.bigNumberify(2),
      gasPrice: '1000000000',
      gasLimit: '1000000',
      gasToken: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
      operationType: 0,
      from: '0xd9822CF2a4C3AccD2AF175A5dF0376D46Dcb848d',
      signature: '0x24e58b6f9cb3f7816110df9116562d6052982ee799fc7004153fb20d2cda21a434d71b8fe6669978c9dd803dfed465e563da0f68b5d45bf35ecc089d79a18eae1c'
    };
    const {status, body} = await chai.request(relayer.server)
      .post('/wallet/execution')
      .send(message);
    expect(status).to.eq(400);
    expect(body.error).to.deep.eq([{path: 'body.nonce', expected: 'string'}]);
  });

  after(async () => {
    await relayer.stop();
  });
});
