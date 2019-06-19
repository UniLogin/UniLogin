import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {getDeployData} from '@universal-login/contracts';
import {OPERATION_CALL, waitForContractDeploy, createSignedMessage, waitExpect, createKeyPair, getDeployedBytecode, computeContractAddress} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import MockToken from '@universal-login/contracts/build/MockToken';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {startRelayer} from './helpers';

chai.use(chaiHttp);

describe('E2E: Relayer - WalletContract routes', async () => {
  let relayer;
  let provider;
  let wallet;
  let otherWallet;
  let contract;
  let deployer;
  let walletMaster;
  let factoryContract;

  before(async () => {
    ({provider, wallet, otherWallet, relayer, deployer, walletMaster, factoryContract} = await startRelayer());
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

  it('Counterfactual deployment', async () => {
    const keyPair = createKeyPair();
    const initCode = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
    const contractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initCode);
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const result = await chai.request(relayer.server)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract)}`);
  });

  it('Counterfactual deployment fail if not enough balance', async () => {
    const keyPair = createKeyPair();
    const result = await chai.request(relayer.server)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(402);
    expect(result.body.type).to.eq('NotEnoughBalance');
    expect(result.body.error).to.eq(`Error: Not enough balance`);
  });

  it('Counterfactual deployment fail if invalid ENS name', async () => {
    const keyPair = createKeyPair();
    const invalidEnsName = 'myname.non-existing.eth';
    const result = await chai.request(relayer.server)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: invalidEnsName
      });
      expect(result.status).to.eq(404);
      expect(result.body.type).to.eq('NotFound');
      expect(result.body.error).to.eq(`Error: ENS domain ${invalidEnsName} does not exist or is not compatible with Universal Login`);
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
        nonce: 0,
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

  after(async () => {
    await relayer.stop();
  });
});
