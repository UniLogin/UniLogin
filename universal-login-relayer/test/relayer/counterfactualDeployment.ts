import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {providers, Wallet} from 'ethers';
import Relayer from '../../lib/relayer';
import {createKeyPair} from '@universal-login/commons';
import {startRelayer} from './routes/helpers';


chai.use(chaiHttp);

describe('Counterfactual deployment', () => {
  let relayer: Relayer;
  let keyPair = createKeyPair();
  let provider: providers.Provider;
  let wallet: Wallet;
  const port = '33511';

  before(async () => {
    ({provider, wallet, relayer} = await startRelayer(port));
  });

  it('Deploy', async () => {
    const result = await chai.request(`http://localhost:${port}`)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: 'myname.mylogin.eth'
      });
    expect(result.status).to.eq(201);
  });
});
