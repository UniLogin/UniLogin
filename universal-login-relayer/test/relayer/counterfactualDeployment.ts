import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {providers, Contract} from 'ethers';
import Relayer from '../../lib/relayer';
import {createKeyPair, computeContractAddress, getDeployedBytecode} from '@universal-login/commons';
import {getDeployData} from '@universal-login/contracts';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {startRelayer} from './routes/helpers';


chai.use(chaiHttp);

describe('Counterfactual deployment', () => {
  let relayer: Relayer;
  const keyPair = createKeyPair();
  let provider: providers.Provider;
  let factoryContract: Contract;
  let walletMaster: Contract;
  const port = '33511';
  let initCode: string;

  before(async () => {
    ({provider, relayer, factoryContract, walletMaster} = await startRelayer(port));
    initCode = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
  });

  after(async () => {
    await relayer.stop();
  });

  it('Deploy', async () => {
    const contractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initCode);
    const result = await chai.request(`http://localhost:${port}`)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
  });
});
