import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, providers, Contract, Wallet} from 'ethers';
import {getDeployData} from '@universal-login/contracts';
import {createKeyPair, getDeployedBytecode, computeContractAddress, KeyPair} from '@universal-login/commons';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {startRelayer} from './helpers';
import Relayer from '../../../lib';

chai.use(chaiHttp);

describe('E2E: Relayer - counterfactual deployment', () => {
  let relayer: Relayer;
  let provider: providers.Provider;
  let deployer: Wallet;
  let walletMaster: Contract;
  let factoryContract: Contract;
  let mockToken: Contract;
  let keyPair: KeyPair;
  let contractAddress: string;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;

  beforeEach(async () => {
    ({provider, relayer, deployer, walletMaster, factoryContract, mockToken} = await startRelayer(relayerPort));
    keyPair = createKeyPair();
    const initCode = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
    contractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initCode);
  });

  it('Counterfactual deployment with ether payment', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
  });


  it('Counterfactual deployment with token payment', async () => {
    await mockToken.transfer(contractAddress, utils.parseEther('0.5'));
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
  });

  it('Counterfactual deployment fail if not enough balance', async () => {
    const result = await chai.request(relayerUrl)
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
    const invalidEnsName = 'myname.non-existing.eth';
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: invalidEnsName
      });
      expect(result.status).to.eq(404);
      expect(result.body.type).to.eq('NotFound');
      expect(result.body.error).to.eq(`Error: ENS domain ${invalidEnsName} does not exist or is not compatible with Universal Login`);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
