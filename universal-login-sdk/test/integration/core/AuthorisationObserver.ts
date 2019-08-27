import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import basicSDK from '../../fixtures/basicSDK';
import UniversalLoginSDK from '../../../lib/api/sdk';
import AuthorisationsObserver from '../../../lib/core/observers/AuthorisationsObserver';
import {waitUntil, signGetAuthorisationRequest, GetAuthorisationRequest} from '@universal-login/commons';
import {utils, Wallet} from 'ethers';
import {createWallet} from '../../helpers/createWallet';


chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

describe('INT: AuthorisationsObserver', async () => {
  let relayer: Relayer;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let authorisationsObserver: AuthorisationsObserver;
  let privateKey: string;
  let wallet: Wallet;
  let getAuthorisationRequest: GetAuthorisationRequest;

  const createGetAuthorisationRequest = (walletContractAddress: string, privateKey: string) => {
    const getauthorisationRequest: GetAuthorisationRequest = {
      walletContractAddress,
      signature: ''
    };
    signGetAuthorisationRequest(getauthorisationRequest, privateKey);
    return getauthorisationRequest;
  };

  beforeEach(async () => {
    ({sdk, relayer, contractAddress, privateKey, wallet} = await loadFixture(basicSDK));
    getAuthorisationRequest = createGetAuthorisationRequest(contractAddress, privateKey);
    ({authorisationsObserver} = sdk);
  });

  it('no authorisation requests', async () => {
    const callback = sinon.spy();
    const unsubscribe = authorisationsObserver.subscribe(getAuthorisationRequest, callback);
    unsubscribe();
    expect(callback).to.have.been.calledWith([]);
  });

  it('one authorisation requests', async () => {
    const callback = sinon.spy();
    const unsubscribe = authorisationsObserver.subscribe(getAuthorisationRequest, callback);
    expect(callback).to.have.been.calledWith([]);
    const {privateKey} = await sdk.connect(contractAddress);
    await waitUntil(() => !!callback.secondCall);
    expect(callback.secondCall.args[0][0]).to.deep.include({
      walletContractAddress: contractAddress,
      key: utils.computeAddress(privateKey)
    });
    unsubscribe();
    expect(callback).to.have.been.calledTwice;
  });

  it('two authorisation requests', async () => {
    const newWalletContract = await createWallet('newlogin.mylogin.eth', sdk, wallet);
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = authorisationsObserver.subscribe(getAuthorisationRequest, callback1);
    const unsubscribe2 = authorisationsObserver.subscribe(getAuthorisationRequest, callback2);

    await sdk.connect(contractAddress);
    await sdk.connect(newWalletContract.contractAddress);

    await waitUntil(() => !!callback1.secondCall);
    await waitUntil(() => !!callback2.secondCall);

    unsubscribe1();
    unsubscribe2();

    expect(callback1).to.have.been.calledTwice;
    expect(callback2).to.have.been.calledTwice;
  });

  after(async () => {
    await relayer.stop();
  });
});
