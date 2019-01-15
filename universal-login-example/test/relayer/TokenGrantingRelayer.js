import {expect} from 'chai';
import {getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import TokenGrantingRelayer from '../../src/relayer/TokenGrantingRelayer';
import EthereumIdentitySDK from 'universal-login-sdk';
import Token from '../../build/Token';
import {utils} from 'ethers';
import ENSBuilder from 'ens-builder';
import DEFAULT_PAYMENT_OPTIONS from '../../config/defaultPaymentOptions';
import {waitUntil} from '../utils';
import path from 'path';
import {getKnex} from '../../src/relayer/utils';


describe('Token Granting Relayer', async () => {
  let provider;
  let deployerPrivateKey;
  let wallet;
  let relayer;
  let tokenContract;
  let sdk;
  let identityPrivateKey;
  let identityContractAddress;

  const relayerUrl = 'http://localhost:33511';

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    deployerPrivateKey = wallet.privateKey;
    tokenContract = await deployContract(wallet, Token, []);
    const defaultDomain = 'mylogin.eth';
    const ensBuilder = new ENSBuilder(wallet);
    const [label, tld] = defaultDomain.split('.');
    const ensAddress = await ensBuilder.bootstrapWith(label, tld);
    sdk = new EthereumIdentitySDK(relayerUrl, provider);
    const config = Object.freeze({
      jsonRpcUrl: 'http://localhost:18545',
      port: 33511,
      privateKey: wallet.privateKey,
      chainSpec: {
        ensAddress,
        chainId: 0},
      ensRegistrars: {
        'mylogin.eth': {
          registrarAddress: ensBuilder.registrars[defaultDomain].address,
          resolverAddress: ensBuilder.resolver.address,
          privateKey: deployerPrivateKey
        }
      },
      tokenContractAddress: tokenContract.address
    });
    const database = getKnex();
    relayer = new TokenGrantingRelayer(config, provider, database);
    await relayer.database.migrate.latest({directory: path.join(__dirname, '../../../universal-login-relayer/migrations')});
    await relayer.start();
    relayer.addHooks();
    [identityPrivateKey, identityContractAddress] = await sdk.create('ja.mylogin.eth');
  });

  describe('Token granting', async () => {
    it('Should transfer tokens, when identity created', async () => {
      const isBalanceGreater = async () =>
        (await tokenContract.balanceOf(identityContractAddress)).gt(utils.bigNumberify(0));

      await waitUntil(isBalanceGreater, 5, 50);
      expect(await tokenContract.balanceOf(identityContractAddress)).to.eq(utils.parseEther('100'));
    });

    it('Should transfer tokens, when adding key', async () => {
      const addKeysPaymentOptions = {...DEFAULT_PAYMENT_OPTIONS, gasToken: tokenContract.address};
      await sdk.addKey(identityContractAddress, wallet.address, identityPrivateKey, addKeysPaymentOptions);
      const isBalanceGreater = async () =>
        (await tokenContract.balanceOf(identityContractAddress)).gt(utils.bigNumberify(utils.parseEther('92')));
      await waitUntil(isBalanceGreater, 5, 50);
      expect(await tokenContract.balanceOf(identityContractAddress)).to.be.above(utils.parseEther('92'));
    });
  });

  after(async () => {
    relayer.stop();
  });
});
