import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {TokenGrantingRelayer} from '../../../../lib/http/relayers/TokenGrantingRelayer';
import {utils, Contract} from 'ethers';
import {getWallets, createMockProvider, solidity} from 'ethereum-waffle';
import {waitUntil, MANAGEMENT_KEY, createSignedMessage, stringifySignedMessageFields} from '@universal-login/commons';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {startRelayer} from '../../../helpers/startRelayer';
import {WalletCreator} from '../../../helpers/WalletCreator';
chai.use(solidity);
chai.use(chaiHttp);


const addKey = async (contractAddress, publicKey, privateKey, tokenAddress, provider) => {
  const data = new utils.Interface(WalletContract.interface).functions['addKey'].encode([publicKey, MANAGEMENT_KEY]);
  const message = {
    gasToken: tokenAddress,
    to: contractAddress,
    from: contractAddress,
    data,
    nonce: parseInt(await (new Contract(contractAddress, WalletContract.interface, provider)).lastNonce(), 10),
  };
  const signedMessage = createSignedMessage(message, privateKey);
  await chai.request('http://localhost:33511')
    .post('/wallet/execution')
    .send(stringifySignedMessageFields(signedMessage));
};

describe('INT: Token Granting Relayer', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let relayer;
  let tokenContract;
  let privateKey;
  let contractAddress;

  beforeEach(async () => {
    ({relayer, tokenContract} = await startRelayer(wallet, TokenGrantingRelayer));
    const walletCreator = new WalletCreator(relayer, wallet);
    ({contractAddress, privateKey} = await walletCreator.deployWallet());
  });

  const isTokenBalanceGreater = (value) => async () =>
    (await tokenContract.balanceOf(contractAddress)).gt(utils.parseEther(value));

  const isTokenBalanceEqual = (value) => async () =>
    (await tokenContract.balanceOf(contractAddress)).eq(value);


  describe('Token granting', async () => {
    it('Grants 100 tokens on contract creation', async () => {
      await waitUntil(isTokenBalanceEqual(utils.parseEther('100')), 5, 50);
    });

    it('Grants 5 tokens on key add', async () => {
      await addKey(contractAddress, wallet.address, privateKey, tokenContract.address, provider);
      await waitUntil(isTokenBalanceGreater('104'), 5, 500);
      const actualBalance = await tokenContract.balanceOf(contractAddress);
      expect(actualBalance).to.be.above(utils.parseEther('104'));
    });
  });

  afterEach(async () => {
    await relayer.stopLater();
  });
});
